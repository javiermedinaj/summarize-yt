import React from 'react';
import { FaYoutube, FaTrash } from 'react-icons/fa';

interface VideoPlayerProps {
  videoUrl: string;
  onClear: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onClear }) => {
  const getVideoId = (url: string) => {
    try {
      return new URL(url).searchParams.get("v");
    } catch {
      return null;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full aspect-w-16 aspect-h-9">
        <iframe
          className="w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${getVideoId(videoUrl)}`}
          title="Video Preview"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      
      <div className="w-full flex items-center justify-between mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 transition-colors duration-200">
        <div className="flex items-center gap-2">
          <FaYoutube className="w-5 h-5 text-red-600 dark:text-red-500" />
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
          >
            Watch on YouTube
          </a>
        </div>
        <button
          onClick={onClear}
          className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
          title="Clear content"
          aria-label="Clear video"
        >
          <FaTrash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
