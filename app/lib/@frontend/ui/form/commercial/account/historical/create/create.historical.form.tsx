"use client";

import {
  Button,
  TimelineItem,
} from "@/app/lib/@frontend/ui/component";
import { useCreateHistoricalForm } from "./use-create.historical.form";
import {
  FaceSmileIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import { CreateAnnexHistoricalModal, SearchContactHistoricalModal, useCreateAnnexHistoricalModal } from "@/app/lib/@frontend/ui/modal";
import { useState } from "react";
import { ContactSelection, IHistorical } from "@/app/lib/@backend/domain";

type Props = {
  accountId: string;
  historical: IHistorical[]
};

export function CreateHistoricalForm({ accountId, historical }: Props) {
  const [selectContact, setSelectContact] = useState<ContactSelection[]>([]);
  const [file, setFile] = useState<string | undefined>()
  const {register, onSubmit} = useCreateHistoricalForm({accountId, selectContact, file});
  const { openModal, open, closeModal } = useCreateAnnexHistoricalModal()

  const handleFileChange = (url: string) => {
    setFile(url)
  }

  return (
    <div className="w-[70%]">
      <form onSubmit={onSubmit}>
        <div className="border rounded-md p-4 mb-4 bg-white ">
          <textarea
            placeholder="Adicione seu histórico..."
            {...register("description")}
            className="w-full resize-none border-none focus:outline-none focus:ring-0 focus:border-none p-0"
            rows={2}
          />
          <div className="flex items-center justify-between mt-2 ">
            <div className="flex ">
              <SearchContactHistoricalModal
                accountId={accountId}
                selectContact={selectContact}
                setSelectContact={(value) => setSelectContact(value)}
              />
              <Button title="Emoji" variant={"ghost"} className="p-1">
                <FaceSmileIcon className="h-5 w-5" />
              </Button>  
              <Button title="Anexar" variant={"ghost"} onClick={openModal} className="p-1">
                <PaperClipIcon className="h-5 w-5" />
              </Button> 
            </div>
            <Button variant={"outline"} type="submit">
              Salvar
            </Button>
          </div>
        </div>
      </form>
      <TimelineItem historical={historical} />
      <CreateAnnexHistoricalModal onFileUploadSuccess={handleFileChange} open={open} closeModal={closeModal} />
    </div>
  );
}