import { useFormContext } from "react-hook-form";
import { CreateAccountFormSchema } from "./use-create.account.form";
import { Input } from "../../../../component";

export function CpfAccountForm() {
    const methods = useFormContext<CreateAccountFormSchema>();

    return (
        <div className="flex flex-col gap-2">
            <Input
                label="Nome completo"
                placeholder="Digite o nome completo"
                {...methods.register("cpf.name")}
            />
            <Input
                label="RG"
                placeholder="Digite o RG"
                {...methods.register("cpf.rg")}
            />
        </div>
    );
}
