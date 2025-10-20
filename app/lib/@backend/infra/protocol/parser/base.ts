export class BaseParser {
  static parser<
    TMethods extends Record<string, (...args: any[]) => any>,
    K extends keyof TMethods,
  >(
    this: { methods(): TMethods },
    input: string[],
    ...keys: K[]
  ): {
    [P in K]?: ReturnType<TMethods[P]>;
  } {
    const table = this.methods();
    const out = {} as {
      [P in K]?: ReturnType<TMethods[P]>;
    };

    for (const key of keys) {
      const fn = table[key];
      out[key] = input
        .map((line) => fn.call(this, line))
        .find((value) => value !== undefined);
    }

    return out;
  }
}
