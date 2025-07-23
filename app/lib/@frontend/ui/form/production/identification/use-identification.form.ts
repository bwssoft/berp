import { Device, ITechnology } from "@/app/lib/@backend/domain";
import { useDebounce } from "@/app/lib/@frontend/hook/use-debounce";
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
  technology: ITechnology;
}) {
  const { onSubmit, technology } = props;

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    reset: hookFormReset,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  const [extractedSerial, setExtractedSerial] = useState<string | undefined>();
  const lastPressRef = useRef<number>(0);
  const inputIdRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = hookFormSubmit(async (data) => {
    const { serial } = data;
    await onSubmit(serial);
  });

  const handleChangeInput = useDebounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setExtractedSerial(event.target.value);
    },
    450
  );

  useEffect(() => {
    if (extractedSerial) {
      switch (technology.name.system) {
        case Device.Model.DM_BWS_NB2:
        case Device.Model.DM_BWS_LORA:
        case Device.Model.DM_BWS_NB2_LORA:
        case Device.Model.DM_BWS_4G: {
          const match = extractedSerial.match(/SN\s*:?\s*([a-fA-F0-9]{8})/i);
          if (match) {
            setValue("serial", match[1], { shouldValidate: true });
          }
          break;
        }
        case Device.Model.DM_E3_PLUS_4G:
          const match = extractedSerial.match(/E3\+4G\s*:?\s*(\d{15})/i);
          if (match) {
            setValue("serial", match[1], { shouldValidate: true });
          }
          break;
        default:
          break;
      }
    }
  }, [extractedSerial, setValue, technology]);

  // useEffect(() => {
  //   const handler = (event: KeyboardEvent) => {
  //     if (event.code === "Space") {
  //       const now = Date.now();
  //       if (now - lastPressRef.current < 300) {
  //         event.preventDefault();
  //         if (inputIdRef.current) {
  //           inputIdRef.current.focus();
  //           inputIdRef.current.value = "";
  //           setValue("serial", "");
  //         }
  //       }
  //       lastPressRef.current = now;
  //     }
  //   };

  //   window.addEventListener("keydown", handler);
  //   return () => window.removeEventListener("keydown", handler);
  // }, []);

  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    reset: hookFormReset,
    inputIdRef,
    handleChangeInput,
  };
}
