import IIdentificationLog from "@/backend/domain/production/entity/identification-log.definition";
import {
  identificationLogRepository,
  firebaseGateway,
} from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { Filter } from "mongodb";
import ExcelJS from "exceljs";
import { PassThrough } from "stream";
import { IFirebaseGateway } from "@/backend/domain/@shared/gateway";

namespace Dto {
  export interface Input extends Filter<IIdentificationLog> {}
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
    // 1. Prepara o PassThrough e o coletor de chunks
    const passThroughStream = new PassThrough();
    const chunks: Buffer[] = [];
    passThroughStream.on("data", (chunk: Buffer) => chunks.push(chunk));

    const bufferPromise = new Promise<Buffer>((resolve, reject) => {
      passThroughStream.on("end", () => resolve(Buffer.concat(chunks)));
      passThroughStream.on("error", reject);
    });

    // 2. Gera nome do arquivo
    const fileName = `export.identification-log.${Date.now()}.xlsx`;

    // 3. Cria o workbook apontando para o PassThrough
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: passThroughStream,
      useStyles: true,
      useSharedStrings: true,
    });
    const worksheet = workbook.addWorksheet("IdentificationLogs");

    // Cabeçalho
    worksheet
      .addRow([
        "Status",
        "Tecnologia",
        "Serial Antes",
        "IMEI Antes",
        "Serial Depois",
        "IMEI Depois",
        "Usuário",
        "Data de Criação",
      ])
      .commit();

    // 4. Itera sobre o cursor e adiciona linhas
    const cursor = await this.repository.findCursor(arg);
    cursor.batchSize(1000);

    for await (const doc of cursor) {
      worksheet
        .addRow([
          doc.status ? "Sucesso" : "Falha",
          doc.technology.system_name,
          doc.equipment_before.serial,
          doc.equipment_before.imei,
          doc.equipment_after.serial,
          doc.equipment_after.imei,
          doc.user.name,
          doc.created_at.toLocaleString(),
        ])
        .commit();
    }

    // 5. Finaliza o workbook e sinaliza o fim do PassThrough
    await workbook.commit();
    passThroughStream.end();

    // 6. Aguarda o buffer completo
    const fileBuffer = await bufferPromise;

    // 7. Converte Buffer → Blob → File e faz upload
    const fileBlob = new Blob([fileBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const file = new File([fileBlob], fileName, {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const bucket = "bcube/production/identification-log/";
    const uploadResult = await this.gateway.uploadFile(file, bucket);

    return uploadResult.url;
  }
}

export const exportIdentificationLogUsecase = singleton(
  ExportIdentificationLogUsecase
);

