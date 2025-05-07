"use client";

import { FormProvider } from "react-hook-form";
import { useCreateAccountForm } from "./use-create.account.form";
import { DocumentAccount } from "./document.account.form";

export function AccountCreateForm() {
  const { methods } = useCreateAccountForm();

  return (
    <FormProvider {...methods}>
      <DocumentAccount />
    </FormProvider>
  );
}
