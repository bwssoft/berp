import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const serial = z.coerce.string({ message: "This field is required." });
// .min(15, { message: "At least 15 characters." })
// .max(15, { message: "Maximum 15 characters." })
// .refine(isImei, { message: "Enter a valid imei." });

const schema = z.object({
  serial,
});

export type Schema = z.infer<typeof schema>;

export function useIdentificationForm(props: {
  onSubmit: (id: string) => Promise<void>;
}) {
  const { onSubmit } = props;

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    reset: hookFormReset,
    watch,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const serial = watch("serial");

  const handleSubmit = hookFormSubmit(async (data) => {
    const { serial } = data;
    await onSubmit(serial);
  });

  // estado, função e use effect para lidar com o auto focus no input a partir de dois apertos na tecla espaço
  const [lastPressTime, setLastPressTime] = useState<number | null>(null);
  const inputIdRef = useRef<HTMLInputElement | null>(null);
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.code === "Space") {
      const currentTime = new Date().getTime();
      if (lastPressTime && currentTime - lastPressTime < 300) {
        event.preventDefault();
        if (inputIdRef.current) {
          inputIdRef.current?.focus();
          inputIdRef.current.value = "";
          setValue("serial", "");
        }
      }
      setLastPressTime(currentTime);
    }
  }, []);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    let id = event.target.value;
    if (
      id.startsWith("E3+4GÇ") ||
      id.startsWith("E3+4G:") ||
      id.startsWith("E3+4Gç")
    ) {
      id = id.replace(/E3\+4G|:|Ç|ç/g, "");
    }
    setValue("serial", id, { shouldValidate: true });
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown, lastPressTime]);

  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    reset: hookFormReset,
    inputIdRef,
    handleChangeInput,
    serial,
  };
}
