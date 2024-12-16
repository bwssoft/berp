"use client";

import {
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import { cn } from "../../../util";

type CheckboxTypes = {
  label: string;
  fullRound?: boolean;
  onLabelEdit: (label: string) => void;
  onDelete: () => void;
  viewOnly: boolean;
} & React.ComponentProps<"input">;

export function CheckboxEditable({
  label,
  fullRound,
  id,
  viewOnly,
  onLabelEdit,
  onDelete,
  ...rest
}: CheckboxTypes) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(label);

  function handleInputEnterPress(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      onLabelEdit(text);
      setIsEditing(false);
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setText(event.target.value);
  }

  return (
    <>
      <fieldset>
        <div className="space-y-5">
          <div className="flex items-start pr-2 pt-2">
            {!viewOnly && (
              <div className="flex h-6 items-center">
                <input
                  type="checkbox"
                  id={id}
                  {...rest}
                  className={cn(
                    "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600",
                    fullRound && "rounded-xl"
                  )}
                />
              </div>
            )}

            <div className="ml-3 text-sm h-6 leading-6 w-full flex flex-row items-center justify-between">
              {!isEditing && (
                <label htmlFor={id} className="font-medium text-gray-900">
                  {text}
                </label>
              )}

              {isEditing && (
                <input
                  className="font-medium text-gray-900 w-full h-6 mr-4 text-sm pl-2"
                  value={text}
                  onKeyDown={handleInputEnterPress}
                  onChange={handleInputChange}
                />
              )}

              {!viewOnly && (
                <div className="flex flex-row gap-3 mr-4">
                  {!isEditing && (
                    <PencilIcon
                      className="w-4 h-4"
                      title="Editar valor da label do checkbox"
                      role="button"
                      onClick={() => setIsEditing((prev) => !prev)}
                    />
                  )}

                  {isEditing && (
                    <CheckCircleIcon
                      className="w-4 h-4"
                      title="Salvar valor da label do checkbox"
                      role="button"
                      onClick={() => {
                        setIsEditing((prev) => !prev);
                        onLabelEdit(text);
                      }}
                    />
                  )}

                  <TrashIcon
                    className="w-4 h-4"
                    title="Deletar checkbox"
                    role="button"
                    onClick={onDelete}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </fieldset>
    </>
  );
}
