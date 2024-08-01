import ExcelJS from 'exceljs';

interface ColumnOption {
  header: string;
  options?: string[];
}

export const createExcelTemplate = async (columns: ColumnOption[]): Promise<ExcelJS.Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Planilha 1');

  // Define o cabeçalho na primeira linha
  columns.forEach((col, index) => {
    const columnIndex = index + 1;
    worksheet.getCell(1, columnIndex).value = col.header;

    // Aplica validação de dados para todas as linhas possíveis
    if (col.options) {
      const columnLetter = worksheet.getColumn(columnIndex).letter; // Obtém a letra da coluna
      const range = `${columnLetter}2:${columnLetter}1048576`; // Definindo validação para todas as linhas até o limite

      worksheet.getColumn(columnIndex).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
        if (rowNumber > 1) { // Aplica a partir da segunda linha
          cell.dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: col?.options ? [`"${col?.options.join(",")}"`] : []
          };
        }
      });
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};
