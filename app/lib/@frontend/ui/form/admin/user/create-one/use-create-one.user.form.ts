import { findManyProfile } from "@/app/lib/@backend/action";
import { createOneUser } from "@/app/lib/@backend/action/admin/user.action";
import { toast } from "@/app/lib/@frontend/hook";
import { isValidCPF } from "@/app/lib/util/is-valid-cpf";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

// domínios permitido para usuários internos
const allowedDomains = [
    "@bwsiot.com",
    "@bwstechnology.com",
    "@mgctechnology.com",
    "@icb.com"
];

export const schema = z.object({
    cpf: z.string().min(11, "CPF obrigatório").refine((value) => isValidCPF(value), "CPF inválido"),
    email: z.string().email("Email inválido!"),
    name: z.string(),
    external: z.boolean(),
    image: z.string().optional(),
    profile_id: z.array(z.string()),
    username: z.string(),
  }).refine((data) => {
    // se externo igual a true é usuario externo, se for false é usuário interno
    if (!data.external) {
      // se for usuário interno
      const emailLower = data.email.toLowerCase();
      return allowedDomains.some((domain) => emailLower.endsWith(domain));
    }
    return true; // se for externo, qualquer e-mail é aceito
  }, {
    path: ["email"],
    message: "Obrigatório informar um email com domínio interno!",
  });

export type Schema = z.infer<typeof schema>;

export function useCreateOneUserForm() {

    const {
        register,
        handleSubmit: hookFormSubmit,
        control,
        formState: { errors },
        setError
    } = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues: {
            external: false, // Por default o checkbox deve estar desmarcado para usuário interno e marcado para usuário externo.
        },
    });

    const profiles = useQuery({
        queryKey: ["findManyProfiles"],
        queryFn: () => findManyProfile({}),
      });
      
    const activeProfiles = profiles.data?.filter((p) => p.active) ?? [];

    const handleSubmit = hookFormSubmit(async (data) => {
        const { success, error } = await createOneUser({
            ...data, image: "",
            active: true,
            lock: false
        });
        if(success) {
            toast({
                title: "Sucesso!",
                description: "Usuário registrado com sucesso!",
                variant: "success",
        
            });
        } else if (error) {
            
            Object.entries(error).forEach(([key, message]) => {
                if (key !== "global" && message) {
                    setError(key as keyof Schema, {
                        type: "manual",
                        message: message as string,
                    });
                }
            });

            if(error.global) {
                toast({
                    title: "Erro!",
                    description: error.global,
                    variant: "error",
                });
            }
        }
        
    });
    
    return {
        handleSubmit,
        register,
        control,
        profiles: activeProfiles,
        errors
    }
}