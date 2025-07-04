"use client"
import { useHandleParamsChange } from "@/app/lib/@frontend/hook/use-handle-params-change";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const schema = z.object({
    name: z.string()
})

export type SearchAttachmentsAnnexFormSchema = z.infer<typeof schema>;

export function useSearchAttachmentsAnnexForm() {

    const {
        register,
        handleSubmit
    } = useForm<SearchAttachmentsAnnexFormSchema>({
        resolver: zodResolver(schema)
    })

    const { handleParamsChange } = useHandleParamsChange();

    const onSubmit = handleSubmit((data) => {
        const params = {
            name: data.name
        }
        handleParamsChange({ ...params });
    });
    
    return {
        register,
        onSubmit
    }
}