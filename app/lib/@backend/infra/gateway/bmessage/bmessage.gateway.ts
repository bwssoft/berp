import path from "path";
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { IBMessageGateway } from "../../../domain/@shared/gateway/bmessage.gateway.interface";
import fs from "fs";
import { singleton } from "@/app/lib/util";
import { HtmlParams } from "./@base/rpc/mail/HtmlParams";
import { ProtoGrpcType } from "./@base/rpc/bmessage";
import { MailServiceClient } from "./@base/rpc/mail/MailService";

// Carregamento do proto
const PROTO_PATH = path.join(process.cwd(), './app/lib/@backend/infra/gateway/bmessage/@base/bmessage.proto');
const CRT_PATH = path.join(process.cwd(), './app/lib/@backend/infra/gateway/bmessage/@base/ca.crt')

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
   keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true
});

const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

// instanciando o servico definido no proto
const BMessageService = proto.mail.MailService;

class BMessageGateway implements IBMessageGateway {
    private client: MailServiceClient;

    constructor() {
        this.client = new BMessageService(
            process.env.BMESSAGE_GRPC_URL!,
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
        
                console.info("Email enviado com sucesso!");
                resolve();
            });
        });
    }
}

export const bmessageGateway = singleton(BMessageGateway)