import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
    document: z.object({
        value: z.string().min(9, "Campo obrigatório"),
        type: z.string(),
    }),
    cpf: z.object({
        name: z.string(),
        rg: z.string(),
    }),
    cnpj: z.object({
        social_name: z.string().min(1),
        fantasy_name: z.string().min(1),
        state_registration: z.string().min(1),
        municipal_registration: z.string().optional(),
        status: z.string().min(1),
        sector: z.string().min(1),
        economic_group_holding: z.string().optional(),
        economic_group_controlled: z.string().optional(),
    }),
});
export type CreateAccountFormSchema = z.infer<typeof schema>;

export function useCreateAccountForm() {
    const methods = useForm<CreateAccountFormSchema>({
        resolver: zodResolver(schema),
    });
    return { methods };
}
