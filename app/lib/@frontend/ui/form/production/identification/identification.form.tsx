"use client";

import { Button, Input } from "../../../component";
import { useIdentificationForm } from "./use-identification.form";

export function IdentificationForm(props: {
  onSubmit: (id: string) => Promise<void>;
  disabled: boolean;
}) {
  const { onSubmit, disabled } = props;
  const {
    handleSubmit,
    errors,
    inputIdRef,
    register,
    handleChangeInput,
    serial,
  } = useIdentificationForm({
    onSubmit,
  });
  return (
    <form
      autoComplete="off"
      className="flex gap-2 items-end w-fit"
      onSubmit={handleSubmit}
    >
      <Input
        {...register("serial")}
        value={serial}
        label="Enter serial to writing"
        placeholder="Field to insert serial"
        ref={inputIdRef}
        error={errors["serial"]?.message ?? ""}
        onChange={handleChangeInput}
      />
      <Button
        disabled={disabled}
        variant="default"
        className="h-fit whitespace-nowrap bg-blue-600 hover:bg-blue-500"
        type="submit"
      >
        Send
      </Button>
    </form>
  );
}
