import { Path } from "@/app/lib/util/path";
import { GetCountryNameByCode } from "@/app/lib/util/get-country-name-by-code";
import { appHashsMapping } from "@/app/lib/constant/app-hashs";
import { IClient } from "../entity";
import { BaseOmieEntity } from "../../../infra/api/controller/commercial/client/client.dto";
import { ClientOmieEntity } from "../../../infra/api/controller/commercial/client/client.validator";
import { ContactDepartmentEnum, ContactRoleEnum } from "../entity/contact.definition";

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
        can_receive_document: false,
        can_sign_contract: false,
        name: data.event.nome_fantasia,
        email: data.event.email ?? undefined,
        phone: `${data.event.telefone1_ddd ?? ""}${data.event.telefone1_numero ?? ""}`,
        role: ContactRoleEnum["other"],
        department: ContactDepartmentEnum["other"],
        id: crypto.randomUUID()
      })
    }
    return contacts;
  }
};