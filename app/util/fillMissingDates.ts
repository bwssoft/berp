import { IInput } from "../lib/definition";

export function fillMissingDates(
  data: {
    enter: number
    exit: number
    balance: number
    input: IInput
    byDay: {
      day: string
      enter: number
      exit: number
      balance: number
    }[]
  }[],
  allDates: string[],
  extractValue: (arg: any) => any
): { name: string, data: any[] }[] {
  return data.map((d) => {
    const dataByDate: { [key: string]: number } = {};
    d.byDay.forEach((_d: any) => {
      dataByDate[_d.day] = extractValue(_d);
    });

    const filledData = allDates.map((date) => dataByDate[date] || 0);

    return {
      name: d.input.name,
      data: filledData,
    };
  });
}