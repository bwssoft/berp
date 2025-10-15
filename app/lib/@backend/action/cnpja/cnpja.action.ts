"use server";

import { cnpjaGateway } from "../../infra/gateway/cnpja/cnpja.gateway";

export async function fetchCnpjData(cnpj: string) {
  return cnpjaGateway.getCnpjData(cnpj);
}

export async function fetchNameData(name: string) {
  return cnpjaGateway.getByName(name);
}

export async function fetcCnpjRegistrationData(cnpj: string) {
  return cnpjaGateway.getCnpjRegistrationData(cnpj);
}
