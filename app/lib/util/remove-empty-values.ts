export const removeEmptyValues = <T>(obj: T): T => {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(removeEmptyValues) as unknown as T;

  const entries = Object.entries(obj).map(([key, value]) => {
    if (typeof value === 'string' && value === '') {
      return [key, undefined];
      // } else if (typeof value === 'number' && value === 0) {
      //   return [key, undefined];
    } else if (typeof value === 'object' && value !== null) {
      return [key, removeEmptyValues(value)];
    } else {
      return [key, value];
    }
  });

  return Object.fromEntries(entries) as T;
};
