import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchDocuments, 
  requestUploadPolicy, 
  uploadToMinio, 
  fetchViewUrl, 
  deleteDocument, 
  deleteAllDocuments 
} from '../api/documentApi';

export const DOC_HOOK_KEY = 'documents';

const getDocumentFromPolicyResponse = (policyData) =>
  policyData?.document ?? policyData?.data?.document ?? null;

const upsertDocumentInCache = (queryClient, newDocument) => {
  if (!newDocument?._id) return;

  queryClient.setQueryData([DOC_HOOK_KEY], (old) => {
    const existing = old?.documents ?? [];
    const alreadyListed = existing.some((doc) => doc._id === newDocument._id);
    if (alreadyListed) return old;

    return {
      ...old,
      documents: [...existing, newDocument],
      total: (old?.total ?? existing.length) + 1,
    };
  });
};

const refreshDocuments = (queryClient) =>
  queryClient.refetchQueries({ queryKey: [DOC_HOOK_KEY] });

// 1. Fetch User Documents
export const useGetDocuments = () => {
  return useQuery({
    queryKey: [DOC_HOOK_KEY],
    queryFn: async () => {
      const data = await fetchDocuments();
      return data || { documents: [], total: 0 };
    }
  });
};

// 2. Upload Flow (2-step process)
export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file) => {
      // Step 1: Request Pre-signed POST Policy
      const policyData = await requestUploadPolicy({
        original_filename: file.name,
        mime_type: file.type,
        file_size: file.size
      });
      
      const { uploadData } = policyData;

      // Step 2: Direct upload to MinIO S3 URL
      await uploadToMinio({
        postURL: uploadData.postURL,
        formData: uploadData.formData,
        file: file,
        mimeType: file.type
      });

      return policyData;
    },
    onSuccess: async (policyData) => {
      const newDocument = getDocumentFromPolicyResponse(policyData);
      upsertDocumentInCache(queryClient, newDocument);
      await refreshDocuments(queryClient);
    }
  });
};

// 3. View Document (Fetch url and open in new tab)
export const useViewDocument = () => {
  return useMutation({
    mutationFn: async (id) => {
      const data = await fetchViewUrl(id);
      return data.url;
    },
    onSuccess: (url) => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  });
};

// 4. Delete Single Document
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await deleteDocument(id);
      return id;
    },
    onSuccess: async (id) => {
      queryClient.setQueryData([DOC_HOOK_KEY], (old) => {
        const existing = old?.documents ?? [];
        const nextDocuments = existing.filter((doc) => doc._id !== id);
        return {
          ...old,
          documents: nextDocuments,
          total: nextDocuments.length,
        };
      });
      await refreshDocuments(queryClient);
    }
  });
};

// 5. Delete All Documents
export const useDeleteAllDocuments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await deleteAllDocuments();
    },
    onSuccess: async () => {
      queryClient.setQueryData([DOC_HOOK_KEY], { documents: [], total: 0 });
      await refreshDocuments(queryClient);
    }
  });
};
