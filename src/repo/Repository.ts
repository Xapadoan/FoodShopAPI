export type Entry<T> = { id: number } & T;

export abstract class Repository<T extends Record<string, unknown>> {
  protected abstract pageLength: number;

  public async create?(item: T): Promise<Entry<T>>;
  public async read?(search: Partial<Entry<T>>): Promise<Entry<T> | undefined>;
  public async list?(
    search: Record<keyof T, unknown>,
    page: number
  ): Promise<Entry<T>[]>;
  public async update?(id: number, item: Partial<T>): Promise<Entry<T>>;
  public async delete?(id: number): Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public abstract validate(object: any): object is T;
}
