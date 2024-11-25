import { downloadOneProposalDocument, updateOneClientProposalById } from '@/app/lib/@backend/action';
import { Currency, FreightType, IClient, IProposal } from '@/app/lib/@backend/domain';
import { OmieEnterpriseEnum } from '@/app/lib/@backend/domain/@shared/gateway/omie/omie.gateway.interface';
import { toast } from '@/app/lib/@frontend/hook/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
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
});

const LineItemSchema = z.object({
  id: z.string(),
  product_id: z.string(),
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
  installment_quantity: z.number().int().positive(),
  omie_sale_order_id: z.string().optional(),
});

const SignatureProcessSchema = z.object({
  id: z.string(),
  scenario_id: z.string(),
  document_id: z.array(z.string()),
  omie_enterprise: z.custom<OmieEnterpriseEnum>(),
  contact: z.array(z.object({
    id: z.string(),
    sent: z.boolean(),
    seen: z.boolean(),
    signed: z.boolean(),
    requested: z.boolean()
  }))
});

export const schema = z.object({
  phase: z.enum(['negotiation', 'proposal_sent', 'accepted', 'rejected']),
  valid_at: z.coerce.date(),
  probability: z.coerce.number().nonnegative(),
  description: z.string().optional(),
  billing_address: AddressSchema,
  delivery_address: AddressSchema,
  scenarios: z.array(ScenarioSchema).min(1),
  client_id: z.string(),
  billing_process: z.array(BillingProcessSchema).optional(),
  signature_process: z.array(SignatureProcessSchema).optional(),
  documents: z.array(z.any()),
});

type Schema = z.infer<typeof schema>;

export { type Schema as ClientProposalSchema }

interface Props {
  defaultValues: IProposal
  clients: IClient[]
}
export function useClientProposalUpdateForm(props: Props) {
  const { defaultValues, clients } = props
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    reset: hookFormReset,
    getValues,
    watch
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
      await updateOneClientProposalById({ id: defaultValues.id! }, data);
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
    document_key: string;
    proposal: IProposal;
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

  const client_id = watch("client_id");
  const current_client = useMemo(
    () => clients.find((cl) => cl.id === client_id),
    [clients, client_id]
  );

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
    current_client
  };
}
