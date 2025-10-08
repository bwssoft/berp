"use client";

import { Loader2, Settings } from "lucide-react";
import { Button } from '@/frontend/ui/component/button';
import { Input } from '@/frontend/ui/component/input';

import { useIdentificationForm } from "./use-identification.form";
import { ITechnology } from "@/app/lib/@backend/domain";

export function IdentificationForm(props: {
  onSubmit: (
    id: string,
    detected: any[],
    technology: ITechnology
  ) => Promise<void>;
  isIdentifying: boolean;
  isDetecting: boolean;
  technology: ITechnology;
  detected: any[];
}) {
  const { onSubmit, isIdentifying, isDetecting, technology, detected } = props;
  const { handleSubmit, errors, register, handleChangeInput } =
    useIdentificationForm({
      onSubmit,
      technology,
      detected,
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
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); // evita o submit
          }
        }}
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
