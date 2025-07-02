"use client";

import { Button } from "@/app/lib/@frontend/ui/component";
import { TimelineItem } from "@/app/lib/@frontend/ui/list/commercial/historical/time-line-item";
import { useCreateHistoricalForm } from "./use-create.historical.form";
import { FaceSmileIcon, PaperClipIcon } from "@heroicons/react/24/outline";
import {
    CreateAnnexHistoricalModal,
    SearchContactHistoricalModal,
} from "@/app/lib/@frontend/ui/modal";
import { IHistorical } from "@/app/lib/@backend/domain";

type Props = {
    accountId: string;
    historical: IHistorical[];
};

export function CreateHistoricalForm({ accountId, historical }: Props) {
    const {
        register,
        onSubmit,
        openModal,
        setSelectContact,
        selectContact,
        errors,
    } = useCreateHistoricalForm({ accountId });

    return (
        <form className="w-[70%]" onSubmit={onSubmit}>
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
                        <Button
                            title="Emoji"
                            variant={"ghost"}
                            className="p-1"
                            type="button"
                        >
                            <FaceSmileIcon className="h-5 w-5" />
                        </Button>
                        <Button
                            title="Anexar"
                            variant={"ghost"}
                            type="button"
                            onClick={openModal}
                            className="p-1"
                        >
                            <PaperClipIcon className="h-5 w-5" />
                        </Button>
                    </div>
                    <Button variant={"outline"} type="submit">
                        Salvar
                    </Button>
                </div>
            </div>
        </form>
    );
}
