import { downloadOneProposalDocument, updateOneProposalById } from '@/backend/action/commercial/proposal.action';
import {Currency, FreightType, IProposal} from "@/backend/domain/commercial/entity/proposal.definition";
import {IClient} from "@/backend/domain/commercial/entity/client.definition";
import { OmieEnterpriseEnum } from '@/backend/domain/@shared/gateway/omie.gateway.interface';
import { toast } from '@/app/lib/@frontend/hook/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const CurrencyEnum = z.nativeEnum(Currency);
const FreightTypeEnum = z.nativeEnum(FreightType);

const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  postal_code: z.string(),
  country: z.string(),
  district: z.string(),
});

const LineItemSchema = z.object({
  id: z.string(),
  product_id: z.string(),
  negotiation_type_id: z.string(),
  quantity: z.coerce.number().nonnegative(),
  unit_price: z.coerce.number().nonnegative(),
  discount: z.coerce.number().nonnegative(),
  total_price: z.coerce.number().nonnegative(),
});

const ScenarioSchema = z.object({
  id: z.string(),
  name: z.string(),
  currency: CurrencyEnum,
  description: z.string().optional(),
  product_total: z.coerce.number().nonnegative(),
  subtotal_with_discount: z.coerce.number().nonnegative(),
  discount_value: z.coerce.number().nonnegative(),
  grand_total: z.coerce.number().nonnegative(),
  freight: z
    .object({
      value: z.coerce.number().nonnegative(),
      type: FreightTypeEnum,
    })
    .optional(),
  line_items: z.array(LineItemSchema),
});

const BillingProcessSchema = z.object({
  id: z.string(),
  line_item_id: z.array(z.string()),
  omie_enterprise: z.custom<OmieEnterpriseEnum>(),
  installment_quantity: z.coerce.number().nonnegative().min(1).optional(),
  omie_sale_order_id: z.string().optional(),
});

const SignatureProcessSchema = z.object({
  id: z.string(),
  document_id: z.array(z.string()),
  contact: z.array(z.object({
    id: z.string(),
    signed: z.boolean(),
    seen: z.boolean(),
    sent: z.boolean(),
    requested: z.boolean(),
  }))
});

export const schema = z.object({
  description: z.string().optional(),
  billing_address: AddressSchema.optional(),
  delivery_address: AddressSchema.optional(),
  scenarios: z.array(ScenarioSchema).default([]),
  client_id: z.string(),
  billing_process: z.record(z.string(), z.array(BillingProcessSchema)).optional(),
  signature_process: z.record(z.string(), SignatureProcessSchema).optional(),
  documents: z.array(z.any()).default([])
});

type Schema = z.infer<typeof schema>;

export { type Schema as ProposalSchema }

interface Props {
  defaultValues: IProposal
  client: IClient
}
export function useProposalUpdateForm(props: Props) {
  const { defaultValues, client } = props
  const [currentClient, setCurrentClient] = useState<IClient>(client)
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    reset: hookFormReset,
    getValues,
    watch,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues
  });

  // Gerencia apenas o array principal de scenarios
  const {
    fields: scenarios,
    append: appendScenario,
    remove: removeScenario,
  } = useFieldArray({
    control,
    name: 'scenarios',
    keyName: "key"
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await updateOneProposalById({ id: defaultValues.id! }, data);
      toast({
        title: 'Sucesso!',
        description: 'Proposta atualizada com sucesso!',
        variant: 'success',
      });
    } catch (e) {
      toast({
        title: 'Erro!',
        description: 'Falha ao atualizar a oportunidade!',
        variant: 'error',
      });
    }
  });

  const handleDownloadOneProposalDocument = async (props: {
    document: NonNullable<IProposal["scenarios"][number]["signature_process"]>["documents"][number];
  }) => {
    try {
      // Chama a ação do servidor
      const actionResponse = await downloadOneProposalDocument(props);
      // Verifica se a resposta é válida
      if (!actionResponse) {
        console.error("Resposta inválida ao baixar o documento");
        return;
      }

      // Verifica e sanitiza o nome do arquivo
      const fileName = actionResponse.name;

      // Cria um Blob a partir do buffer
      const blob = new Blob([new Uint8Array(actionResponse.buffer)], {
        type: "application/pdf",
      });

      // Cria uma URL temporária para o Blob
      const url = URL.createObjectURL(blob);

      // Cria um link para iniciar o download
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName; // Nome do arquivo
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Libera o objeto URL para evitar vazamento de memória
      URL.revokeObjectURL(url);
      toast({
        title: "Sucesso",
        description: "Documento baixado com sucesso!",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Erro ao baixar o documento!",
        variant: "error",
      });
    }
  };

  const handleChangeClient = (client: IClient) => {
    setCurrentClient(client)
    setValue("billing_address.city", client.address?.city ?? "")
    setValue("billing_address.street", client.address?.street ?? "")
    setValue("billing_address.postal_code", client.address?.postal_code ?? "")
    setValue("billing_address.state", client.address?.state ?? "")
    setValue("billing_address.country", client.address?.country ?? "")
  }

  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    reset: hookFormReset,
    scenarios,
    appendScenario,
    removeScenario,
    getValues,
    handleDownloadOneProposalDocument,
    currentClient,
    handleChangeClient,
    watch
  };
}

