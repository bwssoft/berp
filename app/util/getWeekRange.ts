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