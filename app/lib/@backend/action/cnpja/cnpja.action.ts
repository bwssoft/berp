"use server";

import { cnpjaGateway } from "../../infra";

export async function fetchCnpjData(cnpj: string) {
  return cnpjaGateway.getCnpjData(cnpj);
}

export async function fetchNameData(cnpj: string) {
  return cnpjaGateway.getByName(cnpj);
}

export async function fetcCnpjRegistrationData(cnpj: string) {
  return cnpjaGateway.getCnpjRegistrationData(cnpj);
}
