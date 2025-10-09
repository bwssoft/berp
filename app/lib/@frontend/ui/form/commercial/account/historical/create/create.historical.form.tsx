"use client";

import { Button } from '@/frontend/ui/component/button';

import { SelectedContactCard } from '@/frontend/ui/component/commercial/historical/selected-contact-card';
import { SelectedContactBadge } from '@/frontend/ui/component/commercial/historical/selected-contact-badge';

import { useCreateHistoricalForm } from "./use-create.historical.form";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import { SearchContactHistoricalModal } from "@/app/lib/@frontend/ui/modal";
import {IHistorical} from "@/app/lib/@backend/domain/commercial/entity/historical.definition";
import { SelectedAnnexCard } from "@/app/lib/@frontend/ui/component/commercial/historical/selected-file-card";
import { Dispatch, SetStateAction } from "react";

type Props = {
  accountId: string;
  historical: IHistorical[];
  openModalAnnex?: () => void;
  closeModalAnnex?: () => void;
  file?: { name: string; url: string; id: string };
  setFile?: Dispatch<SetStateAction<{
    name: string;
    url: string;
    id: string;
} | undefined>>
};

export function CreateHistoricalForm({
  accountId,
  openModalAnnex,
  closeModalAnnex,
  file,
  setFile
}: Props) {
  const {
    register,
    onSubmit,
    setSelectContact,
    selectContact,
    onHandleRemoveFile,
    errors,
    isLoading,
  } = useCreateHistoricalForm({ accountId, closeModalAnnex, file, setFile });

  return (
    <form onSubmit={onSubmit}>
      <div></div>

      {/* Selected Contact Card */}
      <SelectedContactCard
        selectContact={selectContact}
        onRemove={() => setSelectContact(undefined)}
      />

      {file && (
        <SelectedAnnexCard 
          selectFile={file} 
          onRemove={onHandleRemoveFile} 
        />
      )}

      <div className="border rounded-md p-4 mb-4 bg-white ">
        <textarea
          placeholder="Adicione seu histórico..."
          {...register("description")}
          className="w-full resize-none border-none focus:outline-none focus:ring-0 focus:border-none p-0"
          rows={2}
        />
        {errors.errors.description && (
          <p className="text-sm text-red-500">
            {errors.errors.description.message}
          </p>
        )}
        <div className="flex items-center justify-between mt-2 ">
          <div className="flex ">
            <SearchContactHistoricalModal
              accountId={accountId}
              selectContact={selectContact!}
              setSelectContact={(value) => setSelectContact(value)}
            />
            {/* <Button
                            title="Emoji"
                            variant={"ghost"}
                            className="p-1"
                            type="button"
                        >
                            <FaceSmileIcon className="h-5 w-5" />
                        </Button> */}
            <Button
              title="Anexar"
              variant={"ghost"}
              type="button"
              onClick={openModalAnnex}
              className="p-1"
            >
              <PaperClipIcon className="h-5 w-5" />
            </Button>
          </div>
          <Button variant={"outline"} type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>
    </form>
  );
}
