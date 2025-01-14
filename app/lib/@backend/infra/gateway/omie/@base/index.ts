import { OmieCallFunctions, OmieCredentials, OmieDefaultParams, OmieEnterpriseEnum } from "@/app/lib/@backend/domain/@shared/gateway/omie.gateway.interface";
import { config } from "@/app/lib/config";
import axios, { AxiosInstance } from "axios";


export class OmieGateway {
  private _apiSecret: string = "";
  private _apiKey: string = "";
  private _baseUrl: string;
  public _httpProvider: AxiosInstance;

  constructor() {
    this._baseUrl = config.OMIE_URL;
    this._httpProvider = axios.create({
      baseURL: this._baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this._httpProvider.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        if (error.response) {
          console.error(error.response.status, error.response.data);
        } else if (error.request) {
          console.error(error.request);
        } else {
          console.error("Error", error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  private handlePagination(
    params: Omit<OmieDefaultParams, "apenas_importado_api"> = {
      pagina: 1,
      registros_por_pagina: 10,
    }
  ) {
    return {
      apenas_importado_api: "N",
      pagina: params.pagina ?? 1,
      registros_por_pagina: params.registros_por_pagina ?? 10,
    } as OmieDefaultParams;
  }

  formatOmieBodyRequest(
    call: OmieCallFunctions,
    params?: Omit<OmieDefaultParams, "apenas_importado_api">,
    secrets?: Partial<OmieCredentials>
  ) {
    return {
      call,
      app_key: this._apiKey,
      app_secret: this._apiSecret,
      // param: [this.handlePagination(params)] ### não estava passando os paramentros?
      param: [{ ...params, ...this.handlePagination(params) }],
    };
  }

  formatBody<T>(call: OmieCallFunctions, params?: T) {
    return {
      call,
      app_key: this._apiKey,
      app_secret: this._apiSecret,
      param: [params],
    };
  }

  setSecrets(params: OmieEnterpriseEnum) {
    this._apiKey = config.OMIE_SECRETS[params]!.key;
    this._apiSecret = config.OMIE_SECRETS[params]!.secret;
  }
}
