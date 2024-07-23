type Constructor<T> = new (...args: any[]) => T;

const singletons = new Map<Constructor<any>, any>();

export function singleton<T>(Class: Constructor<T>): T {
  if (!singletons.has(Class)) {
    singletons.set(Class, new Class());
  }
  return singletons.get(Class) as T;
}
