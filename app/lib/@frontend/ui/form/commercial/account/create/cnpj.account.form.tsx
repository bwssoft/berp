import { useFormContext } from "react-hook-form";
import { CreateAccountFormSchema } from "./use-create.account.form";
import { Input } from "../../../../component";

export function CNPJAccountForm() {
  const methods = useFormContext<CreateAccountFormSchema>();
  return (
    <div>
      <Input label="Razão Social" {...methods.register("cnpj.social_name")} />
      <Input label="Nome Fantasia" {...methods.register("cnpj.fantasy_name")} />
    </div>
  );
}
