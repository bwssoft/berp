import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { HtmlParams, IBMessageGateway } from "../../../domain/@shared/gateway/bmessage.gateway.interface";
import fs from "fs";
import { singleton } from "@/app/lib/util";

// Carregamento do proto
const PROTO_PATH = path.resolve(__dirname, "./@base/bmessage.proto");
const CRT_PATH = path.resolve(__dirname, "./@base/ca.crt");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true
});

const proto = grpc.loadPackageDefinition(packageDefinition) as any;

// instanciando o servico definido no proto
const BMessageService = proto.bmessage.BMessageService;

class BMessageGateway implements IBMessageGateway {
    private client: any; // qual o tipo que eu coloco aqui

    constructor() {
        this.client = new BMessageService(
            process.env.BMESSAGE_GRPC_URL,
            grpc.credentials.createSsl(fs.readFileSync(CRT_PATH))
        );
    }
    
    html(input: HtmlParams): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.client.html(input, (err: grpc.ServiceError | null) => {
                if (err) {
                    console.error("error:", err);
                    return reject(new Error("Erro ao enviar email via gRPC"));
                }
        
                console.log("Email enviado com sucesso!");
                resolve();
            });
        });
    }
}

export const bmessageGateway = singleton(BMessageGateway)