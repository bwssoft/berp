import { Path } from "@/app/lib/util/path";
import { IClient, OmieEnterprise } from "../../../client";
import { BaseOmieEntity } from "../entities/base.omie.entity";
import { ClientOmieEntity } from "../entities/client.omie.entity";
import { OmieEnterpriseKeyConstants } from "../../constants/omie.enterprise.key.constants";
import { GetCountryNameByCode } from "@/app/lib/util/getCountryNameByCode";

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
  corporate_name: (data) => data.event.nome_fantasia,
  omie_code_metadata: (data) => {
    const enterprise = OmieEnterpriseKeyConstants[data.appHash];
    return {
      [enterprise]: data.event.codigo_cliente_omie
    }
  },
  state_registration: (data) => data.event.inscricao_estadual,
  municipal_registration: (data) => data.event.inscricao_municipal,
  billing_address: (data) => {
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

    if(data.event.telefone1_ddd && data.event.telefone1_numero) {
      contacts.push({
        phone: `${data.event.telefone1_ddd}${data.event.telefone1_numero}`,
        name: data.event.contato,
        role: "owner",
        department: "owner"
      })
    }

    

    if(data.event.telefone2_ddd && data.event.telefone2_numero) {
      const isEquals = contacts.find(contact => {
        return contact.phone === `${data.event.telefone2_ddd}${data.event.telefone2_numero}`;
      });

      if(isEquals) {
        return contacts;
      }

      contacts.push({
        phone: `${data.event.telefone2_ddd}${data.event.telefone2_numero}`,
        name: data.event.contato,
        role: "owner",
        department: "owner"
      })
    }
    
    return contacts;
  }
};