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

  public async listStaffShops(
    staffId: number,
    { name }: Partial<Shop>,
    page: number
  ): Promise<Entry<Shop>[]> {
    const shops = await knex<Entry<Shop>>('shops')
      .innerJoin('shops_staffs', 'shops.id', 'shops_staffs.shop_id')
      .select('shops.*')
      .where({ 'shops_staffs.staff_id': staffId })
      .where('name', 'LIKE', `%${name}%`)
      .offset(page * this.pageLength)
      .limit(this.pageLength);
    return shops;
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

  public async addStaff(shopId: number, staffId: number) {
    await knex('shops_staffs').insert({ staff_id: staffId, shop_id: shopId });
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
