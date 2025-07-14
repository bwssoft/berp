"use client";

import { Loader2, Settings } from "lucide-react";
import { Button, Input } from "../../../component";
import { useIdentificationForm } from "./use-identification.form";

export function IdentificationForm(props: {
  onSubmit: (id: string) => Promise<void>;
  isIdentifying: boolean;
  isDetecting: boolean;
}) {
  const { onSubmit, isIdentifying, isDetecting } = props;
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
        disabled={isDetecting || isIdentifying}
        variant="default"
        type="submit"
      >
        {isDetecting ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            Detectando
          </>
        ) : isIdentifying ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            Gravando
          </>
        ) : (
          <>
            <Settings className="mr-2 h-4 w-4" />
            Gravar
          </>
        )}
      </Button>
    </form>
  );
}
