import {
  IIdentificationLog,
  IIdentificationLogRepository,
} from "@/app/lib/@backend/domain";
import {
  identificationLogRepository,
  firebaseGateway,
} from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { Filter } from "mongodb";
import ExcelJS from "exceljs";
import { PassThrough } from "stream";
import { IFirebaseGateway } from "@/app/lib/@backend/domain/@shared/gateway";

namespace Dto {
  // A entrada é um filtro para selecionar os logs desejados.
  export interface Input extends Filter<IIdentificationLog> {}
  // A saída é a URL do arquivo Excel armazenado no Firebase.
  export type Output = string;
}

class ExportIdentificationLogUsecase {
  repository: IIdentificationLogRepository;
  gateway: IFirebaseGateway;

  constructor() {
    this.repository = identificationLogRepository;
    this.gateway = firebaseGateway;
  }

  async execute(arg: Dto.Input): Promise<Dto.Output> {
    // Cria um stream do tipo PassThrough para capturar os dados do Excel
    const passThroughStream = new PassThrough();

    // Gera o nome do arquivo
    const fileName = `export.identification-log.${Date.now()}.xlsx`;

    // Cria o workbook utilizando o stream (em vez de filename)
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: passThroughStream,
      useStyles: true,
      useSharedStrings: true,
    });
    const worksheet = workbook.addWorksheet("IdentificationLogs");

    // Adiciona a linha de cabeçalho
    worksheet
      .addRow([
        "Status",
        "Tecnologia",
        "Serial",
        "IMEI",
        "ICCID",
        "Firmware",
        "Usuário",
        "Data de Criação",
      ])
      .commit();

    // Obtém os documentos via cursor (AsyncIterable)
    const cursor = await this.repository.findCursor(arg);
    cursor.batchSize(1000);

    // Itera sobre os documentos e adiciona cada um como linha na planilha
    for await (const doc of cursor) {
      worksheet
        .addRow([
          doc.status ? "Sucesso" : "Falha",
          doc.technology.system_name,
          doc.equipment.serial,
          doc.equipment.imei,
          doc.equipment.iccid ?? "--",
          doc.equipment.firmware,
          doc.user.name,
          doc.created_at.toLocaleString(),
        ])
        .commit();
    }

    // Finaliza a escrita do arquivo
    await workbook.commit();

    // Converte o conteúdo do stream para um Buffer
    const fileBuffer = await streamToBuffer(passThroughStream);

    // Converte o Buffer para um Blob com o MIME type do Excel
    const fileBlob = new Blob([fileBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const file = new File([fileBlob], fileName, {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Envia o arquivo para o Firebase Storage via gateway.
    // Aqui reutilizamos o método uploadFile, que espera um File;
    // fazemos um cast para File (em ambiente Node pode ser necessário polyfill)
    const bucket = "bcube/production/identification-log/"; // Nome ou caminho do bucket desejado
    const uploadResult = await this.gateway.uploadFile(file, bucket);

    // Retorna a URL do arquivo no Firebase Storage
    return uploadResult.url;
  }
}

// Função auxiliar para coletar os dados do stream em um Buffer
function streamToBuffer(stream: PassThrough): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

export const exportIdentificationLogUsecase = singleton(
  ExportIdentificationLogUsecase
);
