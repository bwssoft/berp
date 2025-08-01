"use client";

import { Button } from "@/app/lib/@frontend/ui/component";
import { useCreateHistoricalForm } from "./use-create.historical.form";
import { FaceSmileIcon, PaperClipIcon } from "@heroicons/react/24/outline";
import {
    SearchContactHistoricalModal,
} from "@/app/lib/@frontend/ui/modal";
import { IHistorical } from "@/app/lib/@backend/domain";

type Props = {
    accountId: string;
    historical: IHistorical[];
    openModalAnnex?: () => void
    closeModalAnnex?: () => void
    file?: { name: string; url: string; id: string };
};

export function CreateHistoricalForm({ accountId, openModalAnnex, closeModalAnnex, file }: Props) {
    const {
        register,
        onSubmit,
        setSelectContact,
        selectContact,
        errors,
        isLoading
    } = useCreateHistoricalForm({ accountId, closeModalAnnex, file });

    return (
        <form onSubmit={onSubmit}>
            <div></div>
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
                            setSelectContact={(value) =>
                                setSelectContact(value)
                            }
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
                    <Button
                        variant={"outline"}
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Salvando..." : "Salvar"}
                    </Button>
                </div>
            </div>
        </form>
    );
}
