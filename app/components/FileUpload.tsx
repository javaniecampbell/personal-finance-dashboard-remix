import React, { useRef } from 'react';

type FileUploadProps = {
  onFileUpload: (file: File) => void;
  accept: string;
  children: React.ReactNode;
};

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, accept, children }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
    // Reset the input value to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        style={{ display: 'none' }}
      />
      <div onClick={handleClick}>
        {children}
      </div>
    </div>
  );
};

export default FileUpload;
