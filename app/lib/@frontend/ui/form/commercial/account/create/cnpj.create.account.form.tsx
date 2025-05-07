
import { useFormContext } from "react-hook-form";
import { CreateAccountFormSchema } from "./use-create.account.form";
import { Input } from "../../../../component";

export function CNPJAccountForm() {
  const methods = useFormContext<CreateAccountFormSchema>();
  return (
    <div>
      {/* <Input label="CNPJ" {...methods.register("document.value")}/> */}

      <Input label="Tipo de Pessoa" {...methods.register("document.type")}  defaultValue={"Juríridica"}/>

      <Input label="Razão Social" {...methods.register("cnpj.social_name")}  />

      <Input label="Nome Fantasia" {...methods.register("cnpj.fantasy_name")} />
    </div>
  );
}
