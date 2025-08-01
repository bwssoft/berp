import { useFormContext, Controller } from "react-hook-form";
import { CreateAccountFormSchema } from "./use-create.account.form";
import { Input } from "../../../../component";
import { formatRgOrCpf } from "@/app/lib/util/format-rg-cpf";

export function CpfAccountForm() {
  const methods = useFormContext<CreateAccountFormSchema>();

  return (
    <div className="flex flex-col gap-2">
      <Input
        label="Nome completo"
        placeholder="Digite o nome completo"
        required
        {...methods.register("cpf.name")}
        error={methods.formState.errors.cpf?.name?.message}
      />
      <Controller
        control={methods.control}
        name="cpf.rg"
        render={({ field }) => (
          <Input
            label="RG"
            placeholder={"Digite o RG"}
            value={field.value || ""}
            onChange={field.onChange}
            error={methods.formState.errors.cpf?.rg?.message}
          />
        )}
      />
    </div>
  );
}
