import { findAllInputCategories } from "@/app/lib/@backend/action";
import { IInputCategory } from "@/app/lib/@backend/domain/engineer/entity/input-category.definition";
import ExcelJS from 'exceljs';

export function useDownloadInputBOMForm() {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const inputCategories = await findAllInputCategories();

    const workbook = new ExcelJS.Workbook();
    const sheet = prepareInputSheet(workbook);

    // Adiciona dinamicamente as opções de categoria do usuário na planilha.
    //@ts-expect-error Existe um dataValidations dentro da classe sheet, mas a tipagem nao reconhece
    sheet.dataValidations.add("A2:A99999", {
      type: "list",
      allowBlank: false,
      formulae: formatCategoriesSheetValidationFormulae(inputCategories),
      operator: 'equal',
      showErrorMessage: true,
      errorStyle: 'error',
      error: 'Só é possível preencher com um dos valores disponíveis na lista. Se precisar de mais categorias cadastre uma nova em Engenharia > Insumos > Categorias.'
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

    // Adiciona os headers da planilha.
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

    // Torna o texto da coluna de header em negrito. 
    sheet.getRow(1).font = {
      bold: true
    };

    // Adiciona as opções fixas de unidade de medida.
    //@ts-expect-error Existe um dataValidations dentro da classe sheet, mas a tipagem nao reconhece
    sheet.dataValidations.add("J2:J99999", {
      type: "list",
      allowBlank: false,
      formulae: ['"cm,m,kg,g,ml,l,un"'],
      showErrorMessage: true,
      operator: 'equal',
      errorStyle: 'error',
      error: 'Só é possível preencher com um dos valores disponíveis na lista.',
    })

    // Adiciona formatação de moeda na coluna de Preço.
    sheet.getColumn(9).numFmt = '"R$ "#,##0.00;[Red]\-"R$ "#,##0.00';

    // Adiciona validação decimal na coluna de preço.
    //@ts-expect-error Existe um dataValidations dentro da classe sheet, mas a tipagem nao reconhece
    sheet.dataValidations.add("I2:I99999", {
      type: "decimal",
      allowBlank: false,
      formulae: [0, 9999999],
      showErrorMessage: true,
      operator: 'between',
      showInputMessage: true,
      prompt: 'Use a virgula para valores decimais'
    })

    // Formata a largura das colunas utilizadas para um melhor espaçamento.
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