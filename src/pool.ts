// copied
interface Disposable {
  [Symbol.dispose](): void;
}

type Clearable = {
  clear: () => void;
}

class Pool<T extends Clearable> {
  #pool: Array<T> = [];

  constructor(factory: (p: Pool<T>) => T, count: number) {
    while (count--) {
      const t = factory(this);
      this.#pool.push(t);
    }
  }

  get() {
    const t = this.#pool.pop();

    if (!t) throw new Error("pool empty");

    t.clear();
    return t;
  }
  return(t: T) {
    this.#pool.unshift(t);
  }
}

class Summer {
  #sum = 0;

  clear() {
    this.#sum = 0;
  }

  add(n: number) {
    this.#sum += n;
  }

  result() {
    return this.#sum;
  }
}

const pool = new Pool(() => new Summer(), 1);

const numsArr = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

for (const nums of numsArr) {
  const s = pool.get();
  nums.forEach(n => s.add(n));
  console.log(s.result());
  pool.return(s);
}
