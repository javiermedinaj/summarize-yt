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
      
      <div className="w-full flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <FaYoutube className="w-5 h-5 text-red-600" />
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            Watch on YouTube
          </a>
        </div>
        <button
          onClick={onClear}
          className="text-red-500 hover:text-red-600 transition-colors"
          title="Clear content"
        >
          <FaTrash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
