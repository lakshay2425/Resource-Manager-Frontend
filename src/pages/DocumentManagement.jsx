import React, { useRef, useState } from 'react';
import { 
  useGetDocuments, 
  useUploadDocument, 
  useViewDocument, 
  useDeleteDocument, 
  useDeleteAllDocuments 
} from '../hooks/useDocuments';
import { UploadCloud, FileText, Trash2, Eye, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const DocumentManagement = () => {
  const { data, isLoading, isError } = useGetDocuments();
  const { mutate: uploadDocument, isPending: isUploading } = useUploadDocument();
  const { mutate: viewDocument, isPending: isViewing } = useViewDocument();
  const { mutate: deleteDocument, isPending: isDeleting } = useDeleteDocument();
  const { mutate: deleteAllDocuments, isPending: isDeletingAll } = useDeleteAllDocuments();
  
  const [viewId, setViewId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const closeModal = () => setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  
  const fileInputRef = useRef(null);

  const documents = data?.documents || [];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      toast.error('Invalid file type. Only PDF, PNG, JPG/JPEG, and DOCX allowed.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds the 10MB limit.');
      return;
    }

    uploadDocument(file, {
      onSuccess: () => {
        toast.success('Document uploaded successfully!');
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
      onError: (err) => {
        let errorMessage = 'Failed to upload document.';
        if (err?.response?.status === 403) {
          errorMessage = 'You cannot upload more than 2 documents.';
        } else if (err?.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
        
        toast.error(errorMessage);
        console.error('Upload Error:', err);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    });
  };

  const executeDelete = (id) => {
    setDeleteId(id);
    deleteDocument(id, {
      onSuccess: () => {
        toast.success('Document deleted successfully.');
        setDeleteId(null);
        closeModal();
      },
      onError: (err) => {
        const errorMessage = err?.response?.data?.message || 'Failed to delete document.';
        toast.error(errorMessage);
        setDeleteId(null);
        closeModal();
      }
    });
  };

  const executeDeleteAll = () => {
    deleteAllDocuments(undefined, {
      onSuccess: () => {
        toast.success('All documents deleted.');
        closeModal();
      },
      onError: (err) => {
        const errorMessage = err?.response?.data?.message || 'Failed to delete documents.';
        toast.error(errorMessage);
        closeModal();
      }
    });
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Document',
      message: 'Are you sure you want to delete this document?',
      onConfirm: () => executeDelete(id)
    });
  };

  const handleView = (id) => {
    setViewId(id);
    viewDocument(id, {
      onSettled: () => setViewId(null),
      onError: (err) => {
        const errorMessage = err?.response?.data?.message || 'Failed to view document.';
        toast.error(errorMessage);
      }
    });
  };

  const handleDeleteAll = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete All Documents',
      message: 'Are you ABSOLUTELY sure you want to delete ALL documents? This action cannot be undone.',
      onConfirm: () => executeDeleteAll()
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Document Management</h1>
            <p className="mt-2 text-sm text-gray-600">Securely upload, view, and manage your resources.</p>
          </div>
          
          {documents.length > 0 && (
            <button
              onClick={handleDeleteAll}
              disabled={isDeletingAll || isUploading}
              className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
            >
              {isDeletingAll ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete All
            </button>
          )}
        </div>

        {/* Upload Zone */}
        <div className="relative border-2 border-dashed border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-colors group">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
            accept=".pdf,.png,.jpg,.jpeg,.docx"
          />
          <div className="p-12 text-center flex flex-col items-center justify-center">
            {isUploading ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <div className="text-lg font-medium text-blue-600">Uploading your document...</div>
                <p className="text-sm text-gray-500">Connecting to secure storage...</p>
              </div>
            ) : (
              <>
                <div className="p-3 bg-indigo-50 rounded-full group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Click or drag file to this area to upload</h3>
                <p className="mt-2 text-sm text-gray-500">Support for a single PDF, PNG, JPG, or DOCX (Max 10MB).</p>
              </>
            )}
          </div>
        </div>

        {/* Documents Content */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Your Documents</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : isError ? (
            <div className="bg-red-50 p-4 rounded-md flex items-start text-red-700">
              <AlertCircle className="w-5 h-5 mr-3 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-medium">Failed to load documents</h3>
                <p className="mt-1 text-sm text-red-600">There was an error communicating with the server. Please try again.</p>
              </div>
            </div>
          ) : documents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center flex flex-col items-center">
              <div className="p-3 bg-gray-50 rounded-full mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No documents found</h3>
              <p className="mt-1 text-sm text-gray-500 mb-6">Get started by uploading your first document.</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <UploadCloud className="w-4 h-4 mr-2" />
                Upload Document
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <div key={doc._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                  <div className="flex-1 p-5 flex items-start space-x-4">
                    <div className="shrink-0 pt-1">
                      <FileText className="w-8 h-8 text-indigo-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate" title={doc.original_filename}>
                        {doc.original_filename}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                        {doc.mime_type?.split('/')[1] || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 border-t border-gray-100 flex divide-x divide-gray-200">
                    <button
                      onClick={() => handleView(doc._id)}
                      disabled={isViewing || viewId === doc._id}
                      className="flex-1 flex justify-center items-center py-3 text-sm font-medium text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 transition-colors focus:outline-none"
                    >
                      {viewId === doc._id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Eye className="w-4 h-4 mr-2" />
                      )}
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(doc._id)}
                      disabled={isDeleting || deleteId === doc._id}
                      className="flex-1 flex justify-center items-center py-3 text-sm font-medium text-red-600 hover:text-red-900 hover:bg-red-50 transition-colors focus:outline-none"
                    >
                      {deleteId === doc._id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-2" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">{confirmModal.title}</h3>
              <p className="text-sm text-center text-gray-500 mb-6">{confirmModal.message}</p>
              
              <div className="flex space-x-3">
                <button
                  onClick={closeModal}
                  disabled={isDeleting || isDeletingAll}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmModal.onConfirm}
                  disabled={isDeleting || isDeletingAll}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {(isDeleting || isDeletingAll) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DocumentManagement;
