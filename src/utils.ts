export class Waiter<T extends {}> {
  private data: { [key in keyof T]: T[key] | null };

  constructor(
    initData: { [key in keyof T]: T[key] | null },
    private onSuccess: (data: Required<T>) => void
  ) {
    this.data = initData;
  }

  setData(data: Partial<T>) {
    this.data = { ...this.data, ...data };
    let hasEmpty = false;
    for (const key in this.data) {
      if (this.data[key] == null) {
        hasEmpty = true;
      }
    }
    if (!hasEmpty) {
      this.onSuccess(this.data as Required<T>);
    }
  }
}
