"use client";

import { useCallback, useEffect, useRef } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "../../../../component/label";
import { Input } from "../../../../component/input";
import { Button } from "../../../../component/button";

const OPEN_RANGE_TO = Number.MAX_SAFE_INTEGER.toString();

const integerField = z
  .string()
  .min(1, "Obrigatório")
  .regex(/^\d+$/, "Use apenas números inteiros")
  .transform((value) => parseInt(value, 10))
  .refine((value) => value >= 0, {
    message: "Deve ser maior ou igual a 0",
  });

const monetaryField = z
  .string()
  .min(1, "Obrigatório")
  .transform((value) => Number(value.replace(",", ".")))
  .refine((value) => Number.isFinite(value), {
    message: "Número inválido",
  })
  .refine((value) => value > 0, {
    message: "Deve ser maior que 0",
  });

const GLOBAL_ERROR_MESSAGE =
  "Ranges must be contiguous, non-overlapping, and [from,to).";

export const priceTierSchema = z
  .object({
    from: integerField,
    to: integerField,
    unitPrice: monetaryField,
  })
  .refine((tier) => tier.from < tier.to, {
    message: "O valor final deve ser maior que o inicial",
    path: ["to"],
  });

export type PriceTier = z.infer<typeof priceTierSchema>;

export const priceTierArraySchema = z
  .array(priceTierSchema)
  .min(1, "Informe pelo menos uma faixa")
  .superRefine((tiers, ctx) => {
    let hasError = false;

    for (let index = 0; index < tiers.length; index += 1) {
      const current = tiers[index];

      if (current.from >= current.to) {
        hasError = true;
        break;
      }

      if (index === 0) {
        continue;
      }

      const previous = tiers[index - 1];

      if (current.from !== previous.to) {
        hasError = true;
        break;
      }
    }

    if (hasError) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: GLOBAL_ERROR_MESSAGE,
        path: [],
      });
    }
  });

const priceTierFormSchema = z.object({
  tiers: priceTierArraySchema,
});

type PriceTierFormValues = z.input<typeof priceTierFormSchema>;

interface PriceTierInputProps {
  initialTiers?: PriceTier[];
  minQuantity?: number;
  onValidChange?: (tiers: PriceTier[] | undefined) => void;
}

function mapTiersToFormValues(
  tiers: PriceTier[] | undefined,
  minQuantity: number
): PriceTierFormValues["tiers"] {
  if (tiers && tiers.length > 0) {
    return tiers.map((tier, index) => {
      const isLast = index === tiers.length - 1;
      const toValue =
        isLast && tier.to === Number.MAX_SAFE_INTEGER
          ? OPEN_RANGE_TO
          : tier.to.toString();

      return {
        from: tier.from.toString(),
        to: toValue,
        unitPrice: tier.unitPrice.toString(),
      };
    });
  }

  return [
    {
      from: minQuantity.toString(),
      to: "",
      unitPrice: "",
    },
    {
      from: minQuantity.toString(),
      to: OPEN_RANGE_TO,
      unitPrice: "",
    },
  ];
}

export function PriceTierInput({
  initialTiers,
  minQuantity = 0,
  onValidChange,
}: PriceTierInputProps) {
  const {
    control,
    register,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<PriceTierFormValues>({
    resolver: zodResolver(priceTierFormSchema),
    mode: "onChange",
    defaultValues: {
      tiers: mapTiersToFormValues(initialTiers, minQuantity),
    },
  });

  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    reset({
      tiers: mapTiersToFormValues(initialTiers, minQuantity),
    });
    initializedRef.current = true;
  }, [initialTiers, minQuantity, reset]);

  const { fields, remove, insert } = useFieldArray({
    control,
    name: "tiers",
  });

  const watchedTiers = useWatch({
    control,
    name: "tiers",
  });

  useEffect(() => {
    const parsed = priceTierFormSchema.safeParse({
      tiers: watchedTiers ?? [],
    });

    if (parsed.success) {
      onValidChange?.(parsed.data.tiers);
    } else {
      onValidChange?.(undefined);
    }
  }, [watchedTiers, onValidChange]);

  const fieldsLength = fields.length;

  useEffect(() => {
    const lastIndex = fieldsLength - 1;
    if (lastIndex >= 0) {
      const current = getValues(`tiers.${lastIndex}.to`);
      if (current === "" || current === undefined || current === null) {
        setValue(`tiers.${lastIndex}.to`, OPEN_RANGE_TO, {
          shouldValidate: true,
        });
      }
    }
  }, [fieldsLength, getValues, setValue]);

  const handleAddTier = useCallback(() => {
    const currentTiers = getValues("tiers");
    const lastIndex = Math.max(currentTiers.length - 1, 0);
    const lastTier = currentTiers[lastIndex];
    const nextFrom = lastTier?.from ?? minQuantity.toString();

    insert(lastIndex, {
      from: nextFrom,
      to: "",
      unitPrice: "",
    });
  }, [getValues, insert, minQuantity]);

  const handleRemoveTier = useCallback(
    (index: number) => {
      remove(index);

      queueMicrotask(() => {
        const currentTiers = getValues("tiers");

        if (index > 0 && index < currentTiers.length) {
          const previousTo = currentTiers[index - 1]?.to ?? "";
          setValue(`tiers.${index}.from`, previousTo, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      });
    },
    [getValues, remove, setValue]
  );

  const rootError = (errors as any)?.root?.message as string | undefined;

  const tiersErrors = errors.tiers;

  return (
    <div className="space-y-4">
      {fields.map((field, index) => {
        const isLast = index === fields.length - 1;
        const fromError =
          Array.isArray(tiersErrors) &&
          tiersErrors[index] &&
          "from" in tiersErrors[index]
            ? (tiersErrors[index]?.from?.message as string | undefined)
            : undefined;

        const toError =
          Array.isArray(tiersErrors) &&
          tiersErrors[index] &&
          "to" in tiersErrors[index]
            ? (tiersErrors[index]?.to?.message as string | undefined)
            : undefined;

        const unitPriceError =
          Array.isArray(tiersErrors) &&
          tiersErrors[index] &&
          "unitPrice" in tiersErrors[index]
            ? (tiersErrors[index]?.unitPrice?.message as string | undefined)
            : undefined;

        const fromRegister = register(`tiers.${index}.from`);
        const toRegister = register(`tiers.${index}.to`);
        const unitPriceRegister = register(`tiers.${index}.unitPrice`);

        return (
          <div key={field.id} className="space-y-2 border p-4 rounded-md">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label className="text-sm">
                  {isLast ? "A partir de:" : "De:"}
                </Label>
                <Input
                  {...fromRegister}
                  readOnly={index > 0}
                  aria-readonly={index > 0}
                  placeholder="0"
                />
                {fromError && (
                  <p className="text-xs text-red-500 mt-1">{fromError}</p>
                )}
              </div>
              {!isLast && (
                <div className="flex-1">
                  <Label className="text-sm">Até</Label>
                  <Input
                    {...toRegister}
                    onChange={(event) => {
                      toRegister.onChange(event);
                      const value = event.target.value;

                      if (fields[index + 1]) {
                        setValue(`tiers.${index + 1}.from`, value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }
                    }}
                    placeholder="0"
                  />
                  {toError && (
                    <p className="text-xs text-red-500 mt-1">{toError}</p>
                  )}
                </div>
              )}
              <div className="flex-1">
                <Label className="text-sm">Preço por unidade</Label>
                <Input {...unitPriceRegister} placeholder="0" />
                {unitPriceError && (
                  <p className="text-xs text-red-500 mt-1">{unitPriceError}</p>
                )}
              </div>
            </div>
            {fields.length > 1 && index > 0 && !isLast && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleRemoveTier(index)}
                >
                  Remover
                </Button>
              </div>
            )}
          </div>
        );
      })}

      <div className="space-y-2">
        <Button type="button" variant="outline" onClick={handleAddTier}>
          Adicionar faixa
        </Button>
        {rootError && <p className="text-xs text-red-500">{rootError}</p>}
      </div>
    </div>
  );
}
