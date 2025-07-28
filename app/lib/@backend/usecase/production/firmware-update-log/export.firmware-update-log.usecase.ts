import {
  IFirmwareUpdateLog,
  IFirmwareUpdateLogRepository,
} from "@/app/lib/@backend/domain";
import {
  firmwareUpdateLogRepository,
  firebaseGateway,
} from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { Filter } from "mongodb";
import ExcelJS from "exceljs";
import { PassThrough } from "stream";
import { IFirebaseGateway } from "@/app/lib/@backend/domain/@shared/gateway";

namespace Dto {
  export interface Input extends Filter<IFirmwareUpdateLog> {}
  export type Output = string;
}

class ExportFirmwareUpdateLogUsecase {
  repository: IFirmwareUpdateLogRepository;
  gateway: IFirebaseGateway;

  constructor() {
    this.repository = firmwareUpdateLogRepository;
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
    const fileName = `export.configuration-log.${Date.now()}.xlsx`;

    // 3. Cria o workbook apontando para o PassThrough
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: passThroughStream,
      useStyles: true,
      useSharedStrings: true,
    });
    const worksheet = workbook.addWorksheet("FirmwareUpdateLogs");

    // Cabeçalho
    worksheet
      .addRow([
        "Status",
        "Tecnologia",
        "Serial",
        "IMEI",
        "Firmware",
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
          doc.equipment.serial,
          doc.equipment.imei,
          doc.equipment.firmware,
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

    const bucket = "bcube/production/configuration-log/";
    const uploadResult = await this.gateway.uploadFile(file, bucket);

    return uploadResult.url;
  }
}

export const exportFirmwareUpdateLogUsecase = singleton(
  ExportFirmwareUpdateLogUsecase
);
