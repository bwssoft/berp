import { IInput, IProduct } from "../definition"

export function fillMissingDates(
  data: {
    enter: number
    exit: number
    balance: number
    input: IInput
    stocks: {
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
    d.stocks.forEach((_d: any) => {
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

export function fillMissingDatesOnInputAnalysisPage(
  data: {
    input: IInput
    stocks: {
      date: { day: number, year: number, month: number }
      enter: number
      exit: number
      balance: number
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

export function fillMissingDatesOnProductAnalysisPage(
  data: {
    product: IProduct
    stocks: {
      date: { day: number, year: number, month: number }
      enter: number
      exit: number
      balance: number
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
      name: d.product.name,
      color: d.product.color,
      data: filledData,
    };
  });
}