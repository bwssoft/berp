import axios, { type AxiosInstance } from "axios";
import {
  OmieEnterpriseEnum,
  type OmieCallFunctions,
  type OmieCredentials,
} from "@/backend/domain/@shared/gateway/omie.gateway.interface";
import { config } from "@/app/lib/config";

type OmieSecretKey = keyof typeof OmieEnterpriseEnum | OmieEnterpriseEnum;

export abstract class OmieGateway {
  protected _httpProvider: AxiosInstance;
  private _credentials: OmieCredentials = {
    app_key: "",
    app_secret: "",
  };

  constructor() {
    this._httpProvider = axios.create({
      baseURL: config.OMIE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  setSecrets(enterprise: OmieSecretKey) {
    const enterpriseKey =
      typeof enterprise === "string"
        ? enterprise
        : OmieEnterpriseEnum[enterprise];

    const secrets = config.OMIE_SECRETS[enterpriseKey as keyof typeof config.OMIE_SECRETS];

    if (!secrets?.key || !secrets?.secret) {
      throw new Error(
        `Missing Omie credentials for enterprise "${enterpriseKey}".`
      );
    }

    this._credentials = {
      app_key: secrets.key,
      app_secret: secrets.secret,
    };
  }

  protected formatBody<TParams>(
    call: OmieCallFunctions,
    params: TParams
  ): {
    call: OmieCallFunctions;
    param: TParams[];
    app_key: string;
    app_secret: string;
  } {
    if (!this._credentials.app_key || !this._credentials.app_secret) {
      throw new Error("Omie credentials were not set before performing a call.");
    }

    return {
      call,
      param: [params],
      app_key: this._credentials.app_key,
      app_secret: this._credentials.app_secret,
    };
  }
}

export { OmieGateway as default };
