export function RemoveFields(...fields: string[]): MethodDecorator {
    return <T>(
      _target: Object,
      _key: string | symbol,
      descriptor: TypedPropertyDescriptor<T>
    ): TypedPropertyDescriptor<T> | void => {
      const originalMethod = descriptor.value as unknown as (...args: any[]) => Promise<any>;
  
      const newMethod = async function (this: any, ...args: any[]): Promise<any> {
        const result = await originalMethod.apply(this, args);
  
        const clean = (item: any) => {
          if (item && typeof item === "object") {
            const cleaned = { ...item };
            for (const field of fields) {
              delete cleaned[field];
            }
            return cleaned;
          }
          return item;
        };
  
        if (Array.isArray(result)) {
          return result.map(clean);
        }
  
        return clean(result);
      };
  
      descriptor.value = newMethod as unknown as T;
  
      return descriptor;
    };
  }
  