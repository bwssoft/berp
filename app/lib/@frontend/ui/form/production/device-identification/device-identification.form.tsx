"use client";

import { Button, Input } from "../../../component";
import { useImeiWriterForm } from "./use-device-identification.form";

export function DeviceIdentificationForm(props: {
  onSubmit: (imeiForWriting: string) => Promise<void>;
  disabled: boolean;
}) {
  const { onSubmit, disabled } = props;
  const {
    handleSubmit,
    errors,
    inputImeiRef,
    register,
    handleChangeInput,
    serial,
  } = useImeiWriterForm({
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
        ref={inputImeiRef}
        error={errors["serial"]?.message ?? ""}
        onChange={handleChangeInput}
      />
      <Button
        disabled={disabled}
        variant="default"
        className="h-fit whitespace-nowrap bg-indigo-600 hover:bg-indigo-500"
        type="submit"
      >
        Send
      </Button>
    </form>
  );
}
