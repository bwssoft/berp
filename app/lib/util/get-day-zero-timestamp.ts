export function getDayZeroTimestamp(date: Date = new Date()): number {
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}
