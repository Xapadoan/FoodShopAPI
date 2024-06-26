export type Entry<T> = {
  id: number;
  created_at?: string;
  updated_at?: string;
} & T;

export abstract class Repository<T extends Record<string, unknown>> {
  protected abstract pageLength: number;

  public async create?(item: T): Promise<Entry<T>>;
  public async read?(search: Partial<Entry<T>>): Promise<Entry<T> | undefined>;
  public async list?(
    search: Record<string, unknown>,
    page: number
  ): Promise<Partial<Entry<T>>[]>;
  public async update?(
    id: number,
    item: Partial<T>
  ): Promise<Entry<T> | undefined>;
  public async delete?(id: number): Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public abstract validate(object: any): object is T;
}
