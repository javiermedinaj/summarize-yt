import React from 'react';
import { FaFileExport, FaFilePdf } from 'react-icons/fa';

interface ExportButtonsProps {
  onExportMarkdown: () => void;
  onExportPDF: () => void;
  isGenerating: boolean;
  hasContent: boolean;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
  onExportMarkdown,
  onExportPDF,
  isGenerating,
  hasContent
}) => {
  const exportOptions = [
    {
      title: 'Export to Markdown',
      icon: FaFileExport,
      label: 'MD',
      onClick: onExportMarkdown,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700',
      hoverBg: 'hover:bg-purple-200'
    },
    {
      title: 'Export to PDF',
      icon: FaFilePdf,
      label: 'PDF',
      onClick: onExportPDF,
      bgColor: 'bg-red-200',
      textColor: 'text-red-700',
      hoverBg: 'hover:bg-red-400'
    }
  ];

  return (
    <div className="w-full mt-6 flex justify-start gap-3">
      <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
        <span className="text-sm text-gray-500 px-2">Export as:</span>
        {exportOptions.map(({ title, icon: Icon, label, onClick, bgColor, textColor, hoverBg }) => (
          <button
            key={label}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors 
              ${bgColor} ${textColor} ${hoverBg} disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={onClick}
            disabled={isGenerating || !hasContent}
            title={title}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
