import { singleton } from "@/app/lib/util";
import { ICnpjaResponse, ICnpjaGateway } from "../../../domain";

export class CnpjaApiGateway implements ICnpjaGateway {
  private readonly baseUrl = "https://open.cnpja.com/office";

  async getCnpjData(cnpj: string): Promise<ICnpjaResponse | null> {
    const cleanCnpj = cnpj.replace(/\D/g, "");

    try {
      const response = await fetch(`${this.baseUrl}/${cleanCnpj}`);

      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        return null;
      }

      const data: ICnpjaResponse = await response.json();
      return data;
    } catch (error) {
      console.error(`Fetch error: ${error}`);
      return null;
    }
  }
}

export const cnpjaGateway = singleton(CnpjaApiGateway);
