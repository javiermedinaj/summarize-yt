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
    <form onSubmit={handleSubmit} className="w-full p-6 sm:p-8 bg-white dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-gray-900 transition-colors duration-200">
      <div className="flex flex-col items-center justify-center gap-4">
        <Link className="w-12 h-12 text-zinc-500 dark:text-zinc-400" />
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-200">Ingrese un link de video</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Copie y pegue la URL del video</p>
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://"
          className="w-full mt-4 p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
        />
        <button type="submit" className="w-full mt-4 px-4 py-3 bg-zinc-900 dark:bg-blue-800 text-white dark:text-gray-100 rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm dark:shadow-gray-950/50">
          Submit
        </button>
      </div>
    </form>
  );
};