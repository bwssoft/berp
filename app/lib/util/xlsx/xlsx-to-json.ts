import ExcelJS from 'exceljs';

export const xlsxToJson = async <T>(files: File[] | null, callback: (arg: any) => T) => {
  if (files) {
    const result: T[] = []
    for (let file of files) {
      const workbook = new ExcelJS.Workbook();
      const arrayBuffer = await file.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);

      workbook.eachSheet((sheet) => {
        const firstRow = sheet.getRow(1)
        sheet.eachRow((row, rowIdx) => {
          if (rowIdx === 1) return
          const obj: { [x: string]: any } = {}
          row.eachCell((cell, i) => {
            const _cell = firstRow.getCell(i);
            const key = _cell.value?.toString()
            if (!key) return
            obj[key] = cell.value
          })
          result.push(callback(obj));
        });
      });
    };
    return result
  }
};

