import { Path } from "@/app/lib/util/path";
import { GetCountryNameByCode } from "@/app/lib/util/get-country-name-by-code";
import { appHashsMapping } from "@/app/lib/constant/app-hashs";
import { IClient } from "../entity";
import { BaseOmieEntity } from "../../../controller/client/client.dto";
import { ClientOmieEntity } from "../../../controller/client/client.validator";

export type IInterceptionObjectConstantsType = {
  [key in Path<IClient>]?: (data: BaseOmieEntity<ClientOmieEntity>) => any;
}

export const InterceptionObjectConstants: IInterceptionObjectConstantsType = {
  "document.value": (data) => {
    const cleaned = data.event.cnpj_cpf.replace(/[^\d]+/g, '');
    return cleaned;
  },
  "document.type": (data) => {
    const cleaned = data.event.cnpj_cpf.replace(/[^\d]+/g, '');
    return cleaned.length === 14 ? "CNPJ" : "CPF";
  },
  "created_at": () => new Date(),
  trade_name: (data) => data.event.nome_fantasia,
  omie_metadata: (data) => {
    const enterprise = appHashsMapping[data.appHash];
    return {
      codigo_cliente_integracao: data.event.codigo_cliente_integracao,
      [enterprise]: data.event.codigo_cliente_omie
    }
  },
  tax_details: (data) => ({
    state_registration: data.event.inscricao_estadual,
    municipal_registration: data.event.inscricao_municipal,
  }),
  address: (data) => {
    return {
      street: data.event.endereco,
      postal_code: data.event.cep,
      city: data.event.cidade,
      state: data.event.estado,
      country: GetCountryNameByCode.execute(Number(data.event.codigo_pais))
    }
  },
  contacts: (data) => {
    const contacts: IClient['contacts'] = [];

    if (data.event.telefone1_ddd && data.event.telefone1_numero) {
      contacts.push({
        created_at: new Date(),
        address: {
          state: data.event.estado || undefined,
          city: data.event.cidade || undefined,
          postal_code: data.event.cep || undefined,
          country: data.event.codigo_pais || undefined,
          street: data.event.endereco || undefined
        },
        can_sign_contract: false,
        name: data.event.nome_fantasia,
        email: data.event.email ? { "principal": data.event.email } : undefined,
        phone: data.event.telefone1_numero ? { "principal": `${data.event.telefone1_ddd ?? ""}${data.event.telefone1_numero ?? ""}` } : undefined,
        labels: { "omie": "omie" },
        id: crypto.randomUUID()
      })
    }
    return contacts;
  }
};