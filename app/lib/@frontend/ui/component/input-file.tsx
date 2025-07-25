"use client";

import React, { useRef, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";

interface FileUploadProps {
  handleFile: (files: File[] | null) => void;
  label?: string;
  id?: string;
  element?: (props: {
    files: File[];
    removeFile: (index: number) => void;
    upload: () => void;
  }) => React.ReactNode;
  multiple?: boolean;
  accept: string;
  currentImageUrl?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  handleFile,
  label,
  id,
  element,
  multiple,
  accept,
  currentImageUrl,
}) => {
  const inputFileId = id ?? `file-upload-${crypto.randomUUID()}`;
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    const updatedFiles = [...selectedFiles, ...newFiles];

    setSelectedFiles(updatedFiles);
    handleFile(updatedFiles); // envia todos os arquivos (antigos + novos)
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);

    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      newFiles.forEach((file) => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
    }
    handleFile(newFiles);
  };

  return (
    <div className="col-span-full">
      {element ? (
        <div>
          {element({
            files: selectedFiles,
            removeFile,
            upload: () => fileInputRef.current?.click(),
          })}
          <input
            id={inputFileId}
            type="file"
            className="sr-only"
            multiple={multiple}
            accept={accept}
            onChange={onFileChange}
            ref={fileInputRef}
          />
        </div>
      ) : (
        <div>
          {label && (
            <label
              htmlFor="cover-photo"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {label}
            </label>
          )}
          <div className="mt-2 flex gap-6 justify-center align-bottom rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
              <PhotoIcon
                className="mx-auto h-12 w-12 text-gray-300"
                aria-hidden="true"
              />
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor={inputFileId}
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                >
                  <span>Selecione os arquivos</span>
                  <input
                    id={inputFileId}
                    type="file"
                    className="sr-only"
                    multiple
                    accept={accept}
                    onChange={onFileChange}
                    ref={fileInputRef}
                  />
                </label>
                <p className="pl-1">ou arraste e solte</p>
              </div>
            </div>
          </div>

          {/* Current image preview */}
          {currentImageUrl && selectedFiles.length === 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-900 mb-2">
                Imagem atual:
              </p>
              <div className="flex items-center gap-3 bg-white border border-gray-200 shadow-sm rounded-md px-4 py-2 w-fit">
                <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img
                    src={currentImageUrl}
                    alt="Avatar atual"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 text-sm">
                    Avatar atual
                  </span>
                  <span className="text-xs text-gray-500">
                    Selecione uma nova imagem para alterar
                  </span>
                </div>
              </div>
            </div>
          )}

          <div>
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Arquivos inseridos:
                </p>
                <ul className="grid gap-3">
                  {selectedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-white border border-gray-200 shadow-sm rounded-md px-4 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                          {file.type.startsWith("image/") ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <PhotoIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800 text-sm truncate max-w-[200px]">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
