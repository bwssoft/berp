import { findAllInputCategories } from "@/app/lib/@backend/action/input/input-category.action";
import { IInputCategory } from "@/app/lib/@backend/domain/input/entity/input-category.definition";
import ExcelJS from 'exceljs';

export function useDownloadInputBOMForm() {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const inputCategories = await findAllInputCategories();
    
    const workbook = new ExcelJS.Workbook();
    const sheet = prepareInputSheet(workbook);

    //@ts-expect-error Existe um dataValidations dentro da classe sheet, mas a tipagem nao reconhece
    sheet.dataValidations.add("A2:A9999", {
      type: "list",
      allowBlank: true,
      formulae: formatCategoriesSheetValidationFormulae(inputCategories),
    });

    const sheetBuffer = await workbook.xlsx.writeBuffer();

    if (sheetBuffer) {
      const blob = new Blob([sheetBuffer]);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'create-input-from-file.xlsx';
      link.click();
      URL.revokeObjectURL(url);
    }
  }

  function prepareInputSheet(workbook: ExcelJS.Workbook) {
    let sheet = workbook.addWorksheet('Planilha');

    sheet.addRow([
      'Categoria', 
      'Nome', 
      'Part Number 1', 
      'Nome Fornecedor 1', 
      'Part Number 2',
      'Nome Fornecedor 2',
      'Part Number 3',
      'Nome Fornecedor 3',
      'Preço',
      'Unidade de Medida'
    ]);

    //@ts-expect-error Existe um dataValidations dentro da classe sheet, mas a tipagem nao reconhece
    sheet.dataValidations.add("J2:J9999", {
      type: "list",
      allowBlank: true,
      formulae: ['"cm,m,kg,g,ml,l,un"'],
    })

    sheet.getRow(1).font = {
      bold: true
    };

    formatSheetColumnsWidth(sheet);
   
    return sheet;
  }

  function formatSheetColumnsWidth(worksheet: ExcelJS.Worksheet) {
    for (let i = 0; i < worksheet.columns.length; i += 1) { 
      let dataMax = 0;
      const column = worksheet.columns[i];
      for (let j = 1; j < (column.values ?? []).length; j += 1) {
        //@ts-expect-error column.values pode sr undefined, mas nesse caso especifico do template
        //                 não tem muito problema, pois os valores da linha de header do Excel 
        //                 é sempre fixo.
        const columnLength = column.values[j].length + 10;
        if (columnLength > dataMax) {
          dataMax = columnLength;
        }
      }
      column.width = dataMax < 10 ? 10 : dataMax;
    }
  }

  function formatCategoriesSheetValidationFormulae(categories: IInputCategory[]) {
    const formulae = categories.reduce((formulae, category, index) => {
      const option = category.code.toUpperCase();
      if (index === 0) {
        return `${option},`
      }

      if (index === categories.length) {
        return `${formulae}${option}`
      }

      return `${formulae}${option},`
    }, "")

    return [`"${formulae}"`]
  }

  return {
    handleSubmit
  }
}