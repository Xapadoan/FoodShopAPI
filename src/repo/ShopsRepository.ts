import { Entry, Repository } from '@repo/Repository';
import knex from '../data';

export type Shop = {
  name: string;
  address: string;
};

export class ShopsRepository extends Repository<Shop> {
  protected pageLength = 100;

  public async read({
    id,
    name,
  }: Partial<Entry<Shop>>): Promise<Entry<Shop> | undefined> {
    if (!id && !name) return undefined;
    const query = knex<Entry<Shop>>('shops').select('*');
    if (id) {
      query.where({ id });
    }
    if (name) {
      query.where({ name });
    }
    const result = await query.first();
    return result;
  }

  public async create(shop: Shop): Promise<Entry<Shop>> {
    const [id] = await knex('shops').insert({
      name: shop.name,
      address: shop.address,
    });
    return {
      id,
      ...shop,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public validate(object: any): object is Shop {
    if (typeof object !== 'object') return false;
    if (typeof object['name'] !== 'string') return false;
    if (object['name'].length < 5) return false;
    if (typeof object['address'] !== 'string') return false;
    if (object['address'].length < 5) return false;
    return true;
  }
}
