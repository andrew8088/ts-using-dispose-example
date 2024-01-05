type Fn<A extends unknown[] = unknown[], R = unknown> = (...args: A) => R;

export function mock<T>(obj: T, key: keyof T, mock: Fn) {
  const origFn = obj[key];
  let count = 0;

  (obj[key] as unknown) = (...args: unknown[]) => {
    count++;
    return mock(...args);
  };

  return {
    get count() {
      return count;
    },
    reset() {
      console.log("disposing");
      obj[key] = origFn;
    },
  };
}

const MyModule = {
  sum(a: number, b: number) {
    return a + b;
  },

  product(a: number, b: number) {
    let p = 0;
    while (a--) {
      p = MyModule.sum(p, b);
    }
    return p;
  },
};

{
  const m = mock(MyModule, "sum", () => 10);

  const x = MyModule.product(3, 4);
  console.log(x);
  console.log("call count", m.count);
  m.reset();
}

const x = MyModule.product(3, 4);
console.log(x);
