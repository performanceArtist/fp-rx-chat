type MyPick = {
  <O, A extends keyof O>(a: A): (o: O) => O[A];
  <O, A extends keyof O, B extends keyof O>(a: A, b: B): (
    o: O,
  ) => Pick<O, A | B>;
  <O, A extends keyof O, B extends keyof O, C extends keyof O>(
    a: A,
    b: B,
    c: C,
  ): (o: O) => Pick<O, A | B | C>;
  <
    O,
    A extends keyof O,
    B extends keyof O,
    C extends keyof O,
    D extends keyof O
  >(
    a: A,
    b: B,
    c: C,
    d: D,
  ): (o: O) => Pick<O, A | B | C | D>;
};

export const pick: MyPick = (...keys: any[]) => (o: any) =>
  keys.length === 1
    ? o[keys[0]]
    : keys.reduce((acc, key) => {
        acc[key] = o[key];
        return acc;
      }, {});
