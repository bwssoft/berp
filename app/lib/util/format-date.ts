type Options = {
  includeHours: boolean;
};

export function formatDate(
  date: Date,
  { includeHours }: Options = { includeHours: false }
) {
  return Intl.DateTimeFormat("pt-br", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    ...(includeHours && {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }),
  }).format(date);
}
