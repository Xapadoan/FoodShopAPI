import knex from '../data';
import { Entry, Repository } from '@repo/Repository';

export type Ingredient = {
  name: string;
};

export class IngredientsRepository extends Repository<Ingredient> {
  protected pageLength = 100;

  public async create({ name }: Ingredient): Promise<Entry<Ingredient>> {
    const result = await knex.transaction(async (trx) => {
      const existing = await trx<Entry<Ingredient>>('ingredients')
        .select('*')
        .where('name', 'LIKE', `%${name}%`)
        .first();
      if (existing) {
        return existing;
      }
      const [id] = await trx('ingredients').insert({ name });
      return { id, name };
    });
    return result;
  }

  public async read({
    name,
  }: Ingredient): Promise<Entry<Ingredient> | undefined> {
    const results = await knex<Entry<Ingredient>>('ingredients')
      .select('*')
      .where({ name })
      .first();
    return results;
  }

  public async list({
    name,
    page,
  }: {
    name: Ingredient['name'];
    page: number;
  }): Promise<Entry<Ingredient>[]> {
    const results = await knex<Entry<Ingredient>>('ingredients')
      .select('*')
      .where('name', 'LIKE', `%${name}%`)
      .offset(page * this.pageLength)
      .limit(this.pageLength);
    return results;
  }

  public async checkExistence(ids: number[]) {
    const results = await knex<number>('ingredients')
      .select('id')
      .whereIn('id', ids);
    return results.length === ids.length;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public validate(object: any): object is Ingredient {
    if (typeof object !== 'object') return false;
    if (typeof object['name'] !== 'string') return false;
    return true;
  }
}
