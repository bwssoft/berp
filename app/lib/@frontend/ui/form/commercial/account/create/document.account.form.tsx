"use client";

import { useFormContext } from "react-hook-form";
import { CreateAccountFormSchema } from "./use-create.account.form";
import { Input } from "../../../../component";

export function DocumentAccount() {
  const methods = useFormContext<CreateAccountFormSchema>();
  return (
    <div>
      <Input label="Documento" {...methods.register("document.value")} />
    </div>
  );
}
