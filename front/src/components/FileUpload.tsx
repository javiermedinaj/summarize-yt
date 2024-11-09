import React, { useState } from 'react';
import { Link } from 'lucide-react';

interface FileUploadProps {
  onUrlSubmit: (url: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUrlSubmit }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onUrlSubmit(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-6 sm:p-8 bg-white shadow-md rounded-xl">
      <div className="flex flex-col items-center justify-center gap-4">
        <Link className="w-12 h-12 text-zinc-500" />
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">Ingrese un link de video</p>
          <p className="text-sm text-gray-500 mt-1">Copie y pegue la URL del video</p>
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://"
          className="w-full mt-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
        <button type="submit" className="w-full mt-4 px-4 py-2 bg-zinc-900 text-white rounded hover:bg-zinc-800 transition">
          Submit
        </button>
      </div>
    </form>
  );
};