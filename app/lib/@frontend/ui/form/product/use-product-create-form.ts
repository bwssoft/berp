import { createOneProduct } from "@/app/lib/@backend/action";
import { ITechnicalSheetWithInputs } from "@/app/lib/@backend/usecase";
import { productConstants } from "@/app/lib/constant/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../../../hook";
import { EProductCategory } from "@/app/lib/@backend/domain";

const schema = z.object({
  name: z
    .string({ required_error: "Esse campo não pode ser vazio" })
    .min(1, "Esse campo não pode ser vazio"),
  description: z
    .string({ required_error: "Esse campo não pode ser vazio" })
    .min(1, "Esse campo não pode ser vazio"),
  technical_sheet: z.any({ required_error: "Selecione uma ficha técnica" }),
  color: z.string(),
  files: z.any(),
  category: z.nativeEnum(EProductCategory),
  sku: z.string(),
  price: z.coerce.number(),
  images: z.array(z.string()).default([]),
});

export type Schema = z.infer<typeof schema>;

const statsMapped = productConstants.statsMapped;

export function useProductCreateForm() {
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
    reset: hookFormReset,
    watch,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      const createOneData = {
        ...data,
        technical_sheet_id: data.technical_sheet.id,
      };

      delete createOneData.technical_sheet;

      //fazer a request
      await createOneProduct(createOneData);

      toast({
        title: "Sucesso!",
        description: "Produto registrado com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao registrar o produto!",
        variant: "error",
      });
    }
  });

  const technicalSheetData = watch("technical_sheet");

  //iteração para agregar os dados dos insumos dobanco de dados com os dados do formulário
  const inputsMerged = useMemo(() => {
    return (
      (
        watch("technical_sheet") as ITechnicalSheetWithInputs
      )?.inputs_metadata?.map((input) => {
        const technicalSheetInputsQuantities = (
          getValues("technical_sheet") as ITechnicalSheetWithInputs
        ).inputs;

        const currentInputQuantity = technicalSheetInputsQuantities.find(
          ({ uuid }) => uuid === input.id
        )?.quantity;

        return {
          input: input!,
          color: input!.color,
          name: input!.name,
          price: input?.price ?? 0,
          total: currentInputQuantity! * (input?.price ?? 0),
          quantity: currentInputQuantity!,
        };
      }) ?? []
    );
  }, [technicalSheetData]);

  //objeto com os valores de insumos em maior e menor quantidade, preço, etc...
  const stats = Object.entries(
    inputsMerged.reduce(
      (acc, item) => {
        if (item.quantity > acc.maxQuantity.quantity) {
          acc.maxQuantity = item;
        }
        if (item.quantity < acc.minQuantity.quantity) {
          acc.minQuantity = item;
        }
        if (item.price > acc.maxPrice.price) {
          acc.maxPrice = item;
        }
        if (item.price < acc.minPrice.price) {
          acc.minPrice = item;
        }
        if (item.total > acc.maxTotal.total) {
          acc.maxTotal = item;
        }
        if (item.total < acc.minTotal.total) {
          acc.minTotal = item;
        }
        return acc;
      },
      {
        maxQuantity: inputsMerged[0],
        minQuantity: inputsMerged[0],
        maxPrice: inputsMerged[0],
        minPrice: inputsMerged[0],
        maxTotal: inputsMerged[0],
        minTotal: inputsMerged[0],
      }
    )
  )
    .filter(([_, entrie]) => entrie)
    .map(([key, entire]) => ({
      name: `${statsMapped[key as keyof typeof statsMapped](entire)}`,
      value: entire.name,
    }));

  const totalCost = inputsMerged.reduce((acc, cur) => acc + cur.total, 0);
  const averageCost =
    totalCost /
    ((watch("technical_sheet") as ITechnicalSheetWithInputs)?.inputs?.length ??
      1);

  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    reset: hookFormReset,
    insights: {
      totalCost,
      stats,
      merged: inputsMerged,
      averageCost,
    },
  };
}
