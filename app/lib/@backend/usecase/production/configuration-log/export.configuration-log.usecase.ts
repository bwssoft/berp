import {
  IConfigurationLog,
  IConfigurationLogRepository,
} from "@/app/lib/@backend/domain";
import { configurationLogRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { Filter } from "mongodb";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

namespace Dto {
  // A entrada é um filtro para selecionar os logs desejados.
  export interface Input extends Filter<IConfigurationLog> {}

  // A saída é o caminho do arquivo Excel gerado.
  export type Output = string;
}

class ExportConfigurationLogUsecase {
  repository: IConfigurationLogRepository;

  constructor() {
    this.repository = configurationLogRepository;
  }

  async execute(arg: Dto.Input): Promise<Dto.Output> {
    // Define o diretório onde os arquivos exportados serão salvos.
    const exportDir = path.join(__dirname, "exports");
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }
    const filePath = path.join(
      exportDir,
      `export.configuration-log.${Date.now()}.xlsx`
    );

    // Cria um workbook utilizando o WorkbookWriter (modo streaming)
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      filename: filePath,
    });
    const worksheet = workbook.addWorksheet("ConfigurationLogs");

    // Adiciona a linha de cabeçalho – ajuste os campos conforme a estrutura do IConfigurationLog
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

    // Obtém os documentos via cursor para processar os dados em fluxo contínuo.
    // Observe que é necessário que o repositório exponha um método como `findCursor`
    // que retorne um AsyncIterable dos documentos.
    const cursor = await this.repository.findCursor(arg);
    cursor.batchSize(1000);

    // Itera sobre os documentos e adiciona cada um como uma linha na planilha.
    // Ajuste a extração dos campos conforme a estrutura do seu log.
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
    return filePath;
  }
}

export const exportConfigurationLogUsecase = singleton(
  ExportConfigurationLogUsecase
);
