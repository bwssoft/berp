import React, { useRef, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";

interface FileUploadProps {
  handleFile: (files: File[] | null) => void;
  label?: string;
  id?: string;
  element?: (props: {
    files: File[];
    removeFile: (index: number) => void;
  }) => React.ReactNode;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  handleFile,
  label,
  id,
  element,
}) => {
  const inputFileId = id ?? `file-upload-${crypto.randomUUID()}`;
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setSelectedFiles((prev) => [...prev, ...files]);
    handleFile(files);
  };

  const removeFile = (index: number) => {
    if (selectedFiles) {
      const newFiles = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(newFiles);

      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        newFiles.forEach((file) => dataTransfer.items.add(file));
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  return (
    <div className="col-span-full">
      {element ? (
        <div onClick={() => fileInputRef.current?.click()}>
          {element({ files: selectedFiles, removeFile })}
          <input
            id={inputFileId}
            type="file"
            className="sr-only"
            multiple
            accept=".xlsx"
            onChange={onFileChange}
            ref={fileInputRef}
          />
        </div>
      ) : (
        <>
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
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Selecione os arquivos</span>
                  <input
                    id={inputFileId}
                    type="file"
                    className="sr-only"
                    multiple
                    accept=".xlsx"
                    onChange={onFileChange}
                    ref={fileInputRef}
                  />
                </label>
                <p className="pl-1">ou arraste e solte</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">
                XLSX até 10MB cada
              </p>
            </div>
          </div>
          <div>
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-900">
                  Arquivos Inseridos:
                </p>
                <ul className="text-sm text-gray-600">
                  {selectedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>
                        {file.name} - {(file.size / 1024 / 1024).toFixed(5)} MB
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="ml-4 text-red-600 hover:text-red-800"
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
