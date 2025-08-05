type Primitive = string | number | boolean | null;

interface Change {
  key: string;
  oldValue: string;
  newValue: string;
}

export function getChangedFields(oldObj: any, newObj: any): Change[] {
  const changes: Change[] = [];

  function isPrimitive(value: any): value is Primitive {
    return (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === null
    );
  }

  function compare(obj1: any, obj2: any, path: string = ""): void {
    const keys = Array.from(
      new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})])
    );

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const fullPath = path ? `${path}.${key}` : key;
      const val1 = obj1?.[key];
      const val2 = obj2?.[key];

      // Arrays
      if (Array.isArray(val1) || Array.isArray(val2)) {
        const arr1 = Array.isArray(val1) ? val1 : [];
        const arr2 = Array.isArray(val2) ? val2 : [];
        if (JSON.stringify(arr1) !== JSON.stringify(arr2)) {
          changes.push({
            key: fullPath,
            oldValue: JSON.stringify(arr1),
            newValue: JSON.stringify(arr2),
          });
        }
        continue;
      }

      // Objetos
      if (
        val1 &&
        typeof val1 === "object" &&
        val2 &&
        typeof val2 === "object" &&
        !Array.isArray(val1) &&
        !Array.isArray(val2)
      ) {
        compare(val1, val2, fullPath);
        continue;
      }

      // Primitivos
      if (isPrimitive(val1) && isPrimitive(val2) && val1 !== val2) {
        changes.push({
          key: fullPath,
          oldValue: String(val1),
          newValue: String(val2),
        });
      }
    }
  }

  compare(oldObj, newObj);
  return changes;
}
