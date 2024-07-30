import ExcelJS from 'exceljs';

interface ColumnOption {
  header: string;
  options?: string[];
}

export const createExcelTemplate = async (columns: ColumnOption[]): Promise<ExcelJS.Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Planilha 1');

  columns.forEach((col, index) => {
    worksheet.getCell(1, index + 1).value = col.header;

    if (col.options) {
      worksheet.getColumn(index + 1).eachCell((cell, rowNumber) => {
        if (rowNumber !== 1) { // Ignora a primeira linha (cabeçalho)
          cell.dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: col.options ? [col.options.join(",")] : []
          };
        }
      });
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer
};
