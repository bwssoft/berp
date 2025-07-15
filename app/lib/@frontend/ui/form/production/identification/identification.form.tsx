"use client";

import { Loader2, Settings } from "lucide-react";
import { Button, Input } from "../../../component";
import { useIdentificationForm } from "./use-identification.form";
import { ITechnology } from "@/app/lib/@backend/domain";

export function IdentificationForm(props: {
  onSubmit: (id: string) => Promise<void>;
  isIdentifying: boolean;
  isDetecting: boolean;
  technology: ITechnology;
}) {
  const { onSubmit, isIdentifying, isDetecting, technology } = props;
  const { handleSubmit, errors, register, handleChangeInput } =
    useIdentificationForm({
      onSubmit,
      technology,
    });
  return (
    <form
      autoComplete="off"
      className="flex gap-2 items-end w-fit"
      onSubmit={handleSubmit}
    >
      <Input
        {...register("serial")}
        // ref={(el) => {
        //   register("serial").ref(el);
        //   inputIdRef.current = el;
        // }}
        label="Enter serial to writing"
        placeholder="Field to insert serial"
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
