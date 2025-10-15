import type { IConfigurationLog } from "@/backend/domain/production/entity/configuration-log.definition";
import type { IConfigurationLogRepository } from "@/backend/domain/production/repository/configuration-log.repository";
import {
  configurationLogRepository,
  firebaseGateway,
} from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import type { Filter } from "mongodb";
import ExcelJS from "exceljs";
import { PassThrough } from "stream";
import type { IFirebaseGateway } from "@/backend/domain/@shared/gateway/firebase.gateway.interface";

namespace Dto {
  export interface Input extends Filter<IConfigurationLog> {}
  export type Output = string;
}

class ExportConfigurationLogUsecase {
  repository: IConfigurationLogRepository;
  gateway: IFirebaseGateway;

  constructor() {
    this.repository = configurationLogRepository;
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
    const worksheet = workbook.addWorksheet("ConfigurationLogs");

    // Cabecalho
    worksheet.addRow([
      "Status",
      "Usuário",
      "Perfil",
      "Data",
      "Serial",
      "IMEI",
      "ICCID",
      "Tecnologia",
      "Firmware",
      "Check",
      "Check normalizado"
    ]);

    // 4. Itera sobre o cursor e adiciona linhas
    const cursor = await this.repository.aggregate<IConfigurationLog>([
      {
        $match: arg,
      },
      {
        $setWindowFields: {
          partitionBy: {
            user_id: "$user.id",
            equipment_imei: "$equipment.imei",
          },
          sortBy: { created_at: -1 },
          output: { rank: { $rank: {} } },
        },
      },
      { $match: { rank: 1 } },
      { $unset: "rank" },
      { $sort: { created_at: 1 } },
    ]);
    cursor.batchSize(1000);

    for await (const doc of cursor) {
      worksheet
        .addRow([
          doc.status ? "Sucesso" : "Falha",
          doc.user.name,
          doc.desired_profile.name,
          new Date(doc.created_at).toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
          }),
          doc.equipment.serial,
          doc.equipment.imei,
          doc.equipment.iccid ?? "--",
          doc.technology.system_name,
          doc.equipment.firmware,
          doc.applied_profile?.check?.raw_check ?? "--",
          doc.applied_profile?.check?.normalized_check ?? "--"
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

export const exportConfigurationLogUsecase = singleton(
  ExportConfigurationLogUsecase
);

