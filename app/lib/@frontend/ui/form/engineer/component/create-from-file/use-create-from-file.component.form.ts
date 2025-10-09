import { createManyComponent } from "@/backend/action/engineer/component/component.action";
import { Component } from "@/backend/domain/engineer/entity/component.definition";
import type { IComponent } from "@/backend/domain/engineer/entity/component.definition";
import type { IComponentCategory } from "@/backend/domain/engineer/entity/component.category.definition";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { xlsxToJson } from "@/app/lib/util";
import { getRandomHexColor } from "@/app/lib/util/get-hex-color";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  components: z.array(
    z.object({
      name: z.string().min(1, "Esse campo não pode ser vazio"),
      measure_unit: z.nativeEnum(Component.Unit),
      category: z.string(),
      color: z.string(),
      price: z.coerce
        .number()
        .optional()
        .refine((number) => (number ? number >= 0 : true)),
      manufacturer: z.array(
        z.object({
          code: z.string(),
          name: z.string(),
        })
      ),
      active: z.boolean().default(true),
    })
  ),
});

export type Schema = z.infer<typeof schema>;

interface Props {
  categories: IComponentCategory[];
}
export function useCreateFromFileComponentForm(props: Props) {
  const { categories } = props;
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    reset: hookFormReset,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const {
    fields: components,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "components",
  });

  const handleAppedComponent = append;
  const handleRemoveComponent = remove;

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      //fazer a request
      const components = data.components
        .map((component) => ({
          ...component,
          category: categories.find((el) => el.code === component.category),
        }))
        .filter(
          (el): el is typeof el & { category: Component.Category } =>
            el.category !== undefined
        );
      await createManyComponent(components);
      toast({
        title: "Sucesso!",
        description: "Componente registrado com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao registrar o componente!",
        variant: "error",
      });
    }
  });

  const handleFile = async (fileList: File[] | null) => {
    const components = await xlsxToJson<{
      name?: string;
      price?: number;
      measure_unit?: Component.Unit;
      category?: string;
      part_number_1?: string;
      part_number_2?: string;
      part_number_3?: string;
      manufacturer_name_1?: string;
      manufacturer_name_2?: string;
      manufacturer_name_3?: string;
    }>(fileList, handleFormatComponentFromFile);

    components?.forEach((component) =>
      handleAppedComponent({
        price: component.price ?? 0,
        category: component.category ?? "",
        measure_unit:
          component.measure_unit ?? ("" as IComponent["measure_unit"]),
        name: component.name ?? "",
        color: getRandomHexColor(),
        active: true,
        manufacturer: [
          {
            code: component.part_number_1 ?? "",
            name: component.manufacturer_name_1 ?? "",
          },
          {
            code: component.part_number_2 ?? "",
            name: component.manufacturer_name_2 ?? "",
          },
          {
            code: component.part_number_3 ?? "",
            name: component.manufacturer_name_3 ?? "",
          },
        ],
      })
    );
  };

  const handleFormatComponentFromFile = (obj: {
    Nome: string;
    Preço: number;
    "Unidade de Medida": string;
    Categoria: string;
    "Part Number 1": string;
    "Part Number 2": string;
    "Part Number 3": string;
    "Nome Fornecedor 1": string;
    "Nome Fornecedor 2": string;
    "Nome Fornecedor 3": string;
  }) => {
    return {
      name: obj.Nome,
      measure_unit: obj["Unidade de Medida"] as IComponent["measure_unit"],
      price: obj["Preço"] ?? undefined,
      category: obj["Categoria"],
      part_number_1: obj["Part Number 1"] ?? undefined,
      part_number_2: obj["Part Number 2"] ?? undefined,
      part_number_3: obj["Part Number 3"] ?? undefined,
      manufacturer_name_1: obj["Nome Fornecedor 1"] ?? undefined,
      manufacturer_name_2: obj["Nome Fornecedor 2"] ?? undefined,
      manufacturer_name_3: obj["Nome Fornecedor 3"] ?? undefined,
    };
  };

  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    reset: hookFormReset,
    handleAppedComponent,
    components,
    handleRemoveComponent,
    handleFile,
  };
}

