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

  async [Symbol.asyncDispose]() {
    if (!this.#failed) {
      for (const fn of this.#tasks) {
        await fn();
      }
    }
  }
}

(async () => {
  await using t = new Transaction();
  t.enqueue(async () => console.log('send success email'));

  await t.run(async () => {
    if (1 + 1 === 2) {
      console.log('work done');
      return;
    }
    throw 'work failed'
  }).catch(console.log);
})();
