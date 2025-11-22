import React, { useState } from 'react';
import { FileUploader, Button, InlineNotification } from '@carbon/react';
import api from '../services/api';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage({ type: '', text: '' });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.post('/import/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage({ 
        type: 'success', 
        text: res.data.message || 'Upload successful! Data has been imported.' 
      });
      setFile(null);
      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Upload failed. Please try again.' 
      });
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h3>Upload Data File</h3>
      <p style={{ marginBottom: '20px', color: '#888' }}>
        Upload an Excel (.xlsx) or CSV file containing storage data
      </p>
      
      {message.text && (
        <InlineNotification
          kind={message.type}
          title={message.type === 'success' ? 'Success' : 'Error'}
          subtitle={message.text}
          onClose={() => setMessage({ type: '', text: '' })}
          style={{ marginBottom: '20px' }}
        />
      )}

      <FileUploader
        labelTitle="Upload data file"
        labelDescription="Excel (.xlsx) or CSV format"
        buttonLabel="Choose file"
        accept={['.xlsx', '.csv']}
        onChange={handleFileChange}
        style={{ marginBottom: '20px' }}
      />
      
      {file && (
        <p style={{ marginBottom: '10px' }}>
          Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
        </p>
      )}

      <Button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload and Import'}
      </Button>
    </div>
  );
};

export default Upload;
