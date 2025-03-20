import {
  createOneConfigurationProfile,
  updateOneProductionOrderLineItem,
  updateOneProductionOrderById,
  deleteOneConfigurationProfileById,
} from "@/app/lib/@backend/action";
import { EType, EUseCase, IProductionOrder } from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { formatConfigurationProfileName } from "../../../engineer/configuration-profile/util";

const LineItemSchema = z.object({
  configuration_profile_id: z.string(),
  parcial_quantity: z.coerce.number(),
  id: z.string(),
});

export const schema = z
  .object({
    client_id: z.string(),
    proposal_id: z.string().optional(),
    financial_order_id: z.string().optional(),
    description: z.string().optional(),
    line_items: z.array(LineItemSchema),
    product_id: z.string(),
    total_quantity: z.number(),
    production_process_id: z.string().optional(),
    production_execution_id: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const totalParcialQuantity = data.line_items.reduce(
      (sum, item) => sum + item.parcial_quantity,
      0
    );

    if (totalParcialQuantity !== data.total_quantity) {
      data.line_items.forEach((_, index) => {
        ctx.addIssue({
          code: "custom",
          message: `A soma das quantidades deve ser ${data.total_quantity}.`,
          path: ["line_items", index, "parcial_quantity"],
        });
      });
    }
  });

type Schema = z.infer<typeof schema>;

interface Props {
  defaultValues: IProductionOrder;
  client_document_value: string;
  technology_brand_name: string;
}

const handleDefaultValues = (defaultValues: IProductionOrder) => {
  return {
    ...defaultValues,
    line_items: defaultValues.line_items.map((item) => ({
      ...item,
      configuration_profile_id: item.configuration_profile_id ?? "",
    })),
  };
};

export function useCreateProductionOrderCreateFromProposal(props: Props) {
  const { defaultValues, client_document_value, technology_brand_name } = props;

  const {
    register,
    control,
    handleSubmit: hookFormSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: handleDefaultValues(defaultValues),
  });

  const {
    fields: lineItemsOnForm,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "line_items",
    keyName: "key",
  });
  const handleAppendLineItem = append;
  const handleRemoveLineItem = remove;

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await updateOneProductionOrderById({ id: defaultValues?.id! }, data);
      toast({
        title: "Sucesso!",
        description: "Ordem de produção atualizada com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao atualizar a ordem de produção!",
        variant: "error",
      });
    }
  });

  const handleCreateConfigurationProfile = async (props: {
    client_id: string;
    technology_id: string;
    line_item_id: string;
    production_order_id: string;
    proposal_id: string;
  }) => {
    const {
      client_id,
      technology_id,
      line_item_id,
      production_order_id,
      proposal_id,
    } = props;

    try {
      const data = watch();
      await updateOneProductionOrderById({ id: defaultValues?.id! }, data);
      const configuration_profile = await createOneConfigurationProfile({
        client_id,
        use_case: EUseCase["CLIENT"],
        technology_id,
        type: EType["CAR"],
        config: {
          general: {},
        },
        name: formatConfigurationProfileName({
          type: EType["CAR"],
          document: client_document_value,
          technology: technology_brand_name,
        }),
      });
      await updateOneProductionOrderLineItem(
        { id: production_order_id, line_item_id },
        { configuration_profile_id: configuration_profile.id },
        proposal_id
      );

      // configuration_profile_id
      // production_order_id
      // production_order_line_item_id
      toast({
        title: "Sucesso!",
        description:
          "Sua requisição para preencher um perfil por compartilhamento foi realizada com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description:
          "Falha ao gerar a requisição de perfil por compartilhamento!",
        variant: "error",
      });
    }
  };

  const handleDeleteConfigurationProfile = async (props: {
    line_item_id: string;
    production_order_id: string;
    proposal_id: string;
    configuration_profile_id: string;
  }) => {
    const {
      configuration_profile_id,
      line_item_id,
      production_order_id,
      proposal_id,
    } = props;

    try {
      await deleteOneConfigurationProfileById({ id: configuration_profile_id });
      await updateOneProductionOrderLineItem(
        { id: production_order_id, line_item_id },
        { configuration_profile_id: null },
        proposal_id
      );

      toast({
        title: "Sucesso!",
        description: "Seu cancelamento foi realizado sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao cancelar!",
        variant: "error",
      });
    }
  };

  useEffect(() => {
    reset(handleDefaultValues(defaultValues));
  }, [defaultValues, reset]);

  return {
    handleSubmit,
    register,
    lineItemsOnForm,
    handleAppendLineItem,
    handleRemoveLineItem,
    errors,
    control,
    handleCreateConfigurationProfile,
    handleDeleteConfigurationProfile,
  };
}
