export function getWeekRange(currentDate: Date): { init: Date, end: Date, dates: string[] } {
  // Cria uma nova instância da data para garantir que não estamos modificando a original
  const date = new Date(currentDate);

  // Obter o dia da semana atual (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)
  const currentDay = date.getDay();

  // Calcular o número de dias desde o último domingo
  const daysSinceLastSunday = currentDay;

  // Calcular o número de dias até o próximo sábado
  const daysUntilNextSaturday = 6 - currentDay;

  // Calcular a data do último domingo
  const lastSunday = new Date(date);
  lastSunday.setDate(date.getDate() - daysSinceLastSunday);

  // Calcular a data do próximo sábado
  const nextSaturday = new Date(date);
  nextSaturday.setDate(date.getDate() + daysUntilNextSaturday);

  // Formatar as datas como strings no formato ISO (YYYY-MM-DD)
  const formatDate = (date: Date): string => date.toISOString().split('T')[0];

  const dates: string[] = [];
  let current = new Date(lastSunday);
  while (current <= nextSaturday) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }

  return {
    init: lastSunday,
    end: nextSaturday,
    dates
  };
}

export function getRange(currentDate: Date, rangeDays: number): { init: Date, end: Date, dates: string[] } {
  // Cria uma nova instância da data para garantir que não estamos modificando a original
  const date = new Date(currentDate);

  // Calcular a data de início (init) e a data de fim (end) do intervalo
  const init = new Date(date);
  init.setDate(date.getDate() - Math.floor(rangeDays / 2));

  const end = new Date(date);
  end.setDate(date.getDate() + Math.ceil(rangeDays / 2) - 1);

  // Formatar as datas como strings no formato ISO (YYYY-MM-DD)
  const formatDate = (date: Date): string => date.toISOString().split('T')[0];

  const dates: string[] = [];
  let current = new Date(init);
  while (current <= end) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }

  return {
    init,
    end,
    dates
  };
}
