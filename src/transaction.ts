class Transaction {
  #failed = false;
  #tasks: Array<() => Promise<void>> = [];

  async run(callback: () => Promise<void>) {
    try {
    await callback();
    } catch (err) {
      this.#failed = true;
      throw err;
    }
  }

  enqueue(callback: () => Promise<void>) {
    this.#tasks.push(callback);
  }

  async done() {
    if (!this.#failed) {
      for (const fn of this.#tasks) {
        await fn();
      }
    }
  }
}

(async () => {
  const t = new Transaction();
  t.enqueue(async () => console.log('send success email'));

  t.run(async () => {
    if (1 + 1 === 2) {
      console.log('work done');
      return;
    }
    throw 'work failed'
  });

  t.done();
})();
