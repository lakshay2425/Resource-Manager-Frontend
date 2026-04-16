import axios from 'axios';
import axiosInstance from '../utilis/Axios.jsx';

export const fetchDocuments = async () => {
  const response = await axiosInstance.get('/api/document/');
  return response.data;
};

export const requestUploadPolicy = async (fileData) => {
  // fileData: { original_filename, mime_type, file_size }
  const response = await axiosInstance.post('/api/document/upload-url', fileData);
  return response.data;
};

export const uploadToMinio = async ({ postURL, formData, file, mimeType }) => {
  // Direct MinIO Upload without Auth headers
  const data = new FormData();
  
  // S3 requires that we append all fields from the policy
  for (const key in formData) {
    data.append(key, formData[key]);
  }
  
  // Important: append Content-Type before the file (MinIO policy needs the matching content type)
  data.append('Content-Type', mimeType);

  // SUPER CRITICAL: MUST append file as the LAST parameter
  data.append('file', file);
  
  // We use standard axios, not axiosInstance to avoid Authorization headers
  const response = await axios.post(postURL, data, {
    headers: {
      // Let browser set the correct multipart boundary by removing Content-Type
      // Or just do not set it explicitly
    }
  });
  
  return response.data;
};

export const fetchViewUrl = async (id) => {
  const response = await axiosInstance.get(`/api/document/${id}/view`);
  return response.data;
};

export const deleteDocument = async (id) => {
  const response = await axiosInstance.delete(`/api/document/${id}`);
  return response.data;
};

export const deleteAllDocuments = async () => {
  const response = await axiosInstance.delete('/api/document/all');
  return response.data;
};
