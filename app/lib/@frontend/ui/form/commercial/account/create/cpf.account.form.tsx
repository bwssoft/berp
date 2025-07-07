import { useFormContext, Controller } from "react-hook-form";
import { CreateAccountFormSchema } from "./use-create.account.form";
import { Input } from "../../../../component";
import {
  formatDocument,
  identifyDocumentType,
} from "@/app/lib/util/format-document";
import { useState } from "react";

export function CpfAccountForm() {
  const methods = useFormContext<CreateAccountFormSchema>();
  const [docType, setDocType] = useState<"cpf" | "rg" | "unknown">("unknown");

  return (
    <div className="flex flex-col gap-2">
      <Input
        label="Nome completo"
        placeholder="Digite o nome completo"
        {...methods.register("cpf.name")}
        error={methods.formState.errors.cpf?.name?.message}
      />
      <Controller
        control={methods.control}
        name="cpf.rg"
        render={({ field }) => (
          <Input
            label="RG/CIN"
            placeholder={"Digite o RG/CIN"}
            value={field.value || ""}
            onChange={(e) => {
              const newDocType = identifyDocumentType(e.target.value);

              const formattedValue = formatDocument(e.target.value);
              field.onChange(formattedValue);

              if (newDocType !== docType) {
                setDocType(newDocType);
              }
            }}
            error={methods.formState.errors.cpf?.rg?.message}
          />
        )}
      />
    </div>
  );
}
