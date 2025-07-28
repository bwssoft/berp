"use server";

import { cnpjaGateway } from "../../infra";

export async function fetchCnpjData(cnpj: string) {
  return cnpjaGateway.getCnpjData(cnpj);
}

export async function fetchNameData(name: string) {
  return cnpjaGateway.getByName(name);
}
