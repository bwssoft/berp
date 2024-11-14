export function RemoveMongoId(): MethodDecorator {
  return (
    _target: Object,
    _key: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]): Promise<any> {
      const result = await originalMethod.apply(this, args);

      if (Array.isArray(result)) {
        return result.map(({ _id, insertedId, ...item }) => ({ ...item }));
      }

      if (typeof result === "object" && result !== null) {
        if ("_id" in result) delete result["_id"];
        if ("insertedId" in result) delete result["_id"];
        return result;
      }

      return result;
    };

    return descriptor;
  };
}
