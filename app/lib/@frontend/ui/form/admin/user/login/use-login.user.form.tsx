import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { auth } from "@/auth";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { authenticate } from "@/backend/action/auth/login.action";

const schema = z.object({
    username: z.string(),
    password: z
        .string()
});

type Schema = z.infer<typeof schema>;

export function useLoginUserForm() {
    const router = useRouter();
    const { update } = useSession();

    const methods = useForm<Schema>({
        resolver: zodResolver(schema),
    });

    const handleSubmit = methods.handleSubmit(async (data) => {
        const login = await authenticate(data);
        await update();

        if (login.success) {
            const session = await auth();
            if (session?.user.temporary_password) {
                router.push(`/set-password?id=${session.user.id}`);
            } else {
                router.push("/home");
                toast({
                    title: "Sucesso!",
                    description: "Login realizado com sucesso.",
                    variant: "success",
                });
            }
        } else {
            toast({
                title: "Erro!",
                description: login.error ?? "Algo deu errado",
                variant: "error",
            });
        }
    });

    return {
        methods,
        handleSubmit,
        register: methods.register,
        errors: methods.formState.errors,
    };
}

