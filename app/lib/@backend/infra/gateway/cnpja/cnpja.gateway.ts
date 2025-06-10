import { singleton } from "@/app/lib/util";
import { ICnpjaResponse, ICnpjaGateway } from "../../../domain";

export class CnpjaApiGateway implements ICnpjaGateway {
  private readonly baseUrl = "https://api.cnpja.com/office";
  chaveApi =
    "c081a2f4-7064-46dd-ae39-ec14e0a242af-6167a7ce-6a4b-4ec2-9ab9-b6a8b501411f";

  async getCnpjData(cnpj: string): Promise<ICnpjaResponse | null> {
    const cleanCnpj = cnpj.replace(/\D/g, "");

    try {
      const response = await fetch(`${this.baseUrl}/${cleanCnpj}`, {
        headers: {
          Authorization: `${this.chaveApi}`,
        },
      });

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

  async getByName(alias: string): Promise<ICnpjaResponse[] | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}?names.in=${encodeURIComponent(alias)}&limit=10`,
        {
          headers: {
            Authorization: `${this.chaveApi}`,
          },
        }
      );

      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      return data.data || data.records;
    } catch (error) {
      console.error(`Fetch error: ${error}`);
      return null;
    }
  }
}

export const cnpjaGateway = singleton(CnpjaApiGateway);
