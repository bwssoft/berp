export const removeNull = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map(removeNull) as unknown as T;
  } else if (obj !== null && typeof obj === 'object') {
    const cleanedObject = Object.entries(obj).reduce((acc, [key, value]) => {
      const cleanedValue = removeNull(value);
      if (cleanedValue !== null && (typeof cleanedValue !== 'object' || (typeof cleanedValue === 'object' && cleanedValue !== null && Object.keys(cleanedValue).length > 0))) {
        acc[key] = cleanedValue;
      }
      return acc;
    }, {} as any);

    return (Object.keys(cleanedObject).length === 0 ? undefined : cleanedObject) as unknown as T;
  }
  return obj;
};