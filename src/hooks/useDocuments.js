import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchDocuments, 
  requestUploadPolicy, 
  uploadToMinio, 
  fetchViewUrl, 
  deleteDocument, 
  deleteAllDocuments 
} from '../api/documentApi';

const DOC_HOOK_KEY = 'documents';

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
    onSuccess: () => {
      // Refresh documents
      queryClient.invalidateQueries({ queryKey: [DOC_HOOK_KEY] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOC_HOOK_KEY] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOC_HOOK_KEY] });
    }
  });
};
