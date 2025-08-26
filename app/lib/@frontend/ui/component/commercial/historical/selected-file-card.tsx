"use client";

import {
    DocumentDuplicateIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface SelectedAnnexCardProps {
  selectFile: {name: string, url: string, id: string};
  onRemove: () => void;
  showAnimation?: boolean;
}

export function SelectedAnnexCard({
  selectFile,
  onRemove,
  showAnimation = true,
}: SelectedAnnexCardProps) {
  if (!selectFile || !selectFile.id) {
    return null;
  }


  const animationClass = showAnimation
    ? "animate-in slide-in-from-top-2 fade-in-0 duration-300"
    : "";

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Anexo selecionado
      </h3>
      <div
        className={`flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm ${animationClass}`}
      >
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <DocumentDuplicateIcon className="w-4 h-4 text-gray-600"/>
            </div>
            <p className="text-sm font-medium text-gray-900 truncate">
                {selectFile.name}
            </p>
        </div>

        <button
          onClick={onRemove}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
          title="Remover file selecionado"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
      </div>
  );
}
