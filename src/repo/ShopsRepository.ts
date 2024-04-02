import { Entry, Repository } from '@repo/Repository';
import knex from '../data';

export type Shop = {
  name: string;
  address: string;
};

export type Staff = {
  name: string;
  apiKey: string;
};

export class ShopsRepository extends Repository<Shop> {
  protected pageLength = 100;

  public async createWithStaff({
    shop,
    staff,
  }: {
    shop: Shop;
    staff: Omit<Staff, 'shopId'>;
  }): Promise<{ shop: Entry<Shop>; staff: Entry<Staff> }> {
    const result = await knex.transaction(async (trx) => {
      const [shopId] = await trx('shops').insert({
        name: shop.name,
        address: shop.address,
      });
      const [staffId] = await trx('staff').insert({
        shop_id: shopId,
        name: staff.name,
        api_key: staff.apiKey,
      });
      return {
        shop: {
          ...shop,
          id: shopId,
        },
        staff: {
          ...staff,
          id: staffId,
          shopId,
        },
      };
    });
    return result;
  }

  public async read({
    id,
    name,
  }: Partial<Entry<Shop>>): Promise<Entry<Shop> | undefined> {
    const query = knex<Entry<Shop>>('shops')
      .select('id', 'name', 'address')
      .first();
    if (!id && !name) return undefined;
    if (id) {
      query.where({ id });
    }
    if (name) {
      query.where({ name });
    }
    const result = await query;
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public validate(object: any): object is Shop {
    if (typeof object !== 'object') return false;
    if (typeof object['name'] !== 'string') return false;
    if (typeof object['address'] !== 'string') return false;
    return true;
  }
}
