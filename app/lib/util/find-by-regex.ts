export function findByRegex(input: string, regex: RegExp) {
  if (!input) return []
  const matches = input.match(regex);
  return matches ? matches.map(match => match.slice(2, -2)) : [];
};
