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
      color: d.input.color,
      data: filledData,
    };
  });
}

export function fillMissingDatesOnAnalysisPage(
  data: {
    input: IInput
    stocks: {
      date: { day: number, year: number, month: number }
      enter: number
      exit: number
      available_balance: number
      cumulative_balance: number
    }[]
  }[],
  allDates: string[],
  extractValue: (arg: any) => any
): { name: string, data: any[] }[] {
  return data.map((d) => {
    const dataByDate: { [key: string]: number } = {};
    d.stocks.forEach((_d: any) => {
      dataByDate[`${_d.date.year}-${String(_d.date.month).padStart(2, '0')}-${String(_d.date.day).padStart(2, '0')}`] = extractValue(_d);
    });

    const filledData = allDates.map((date) => dataByDate[date] || 0);

    return {
      name: d.input.name,
      color: d.input.color,
      data: filledData,
    };
  });
}