import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
    document: z.object({
        value: z.string(),
        type: z.string(),
    }),
    cpf: z.object({
        name: z.string(),
        rg: z.string(),
    }),
    cnpj: z.object({
        social_name: z.string(),
        fantasy_name: z.string(),
    }),
});
export type CreateAccountFormSchema = z.infer<typeof schema>;

export function useCreateAccountForm() {
    const methods = useForm<CreateAccountFormSchema>({
        resolver: zodResolver(schema),
    });
    return { methods };
}
