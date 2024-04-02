import { Entry, Repository } from '@repo/Repository';
import knex from '../data';

export type Staff = {
  name: string;
  email: string;
};

export class StaffRepository extends Repository<Staff> {
  protected pageLength = 50;

  public async create(staff: Staff): Promise<Entry<Staff>> {
    const [id] = await knex('staffs').insert({
      name: staff.name,
      email: staff.email,
    });
    return {
      id,
      ...staff,
    };
  }

  public async read(
    search: Partial<Entry<Staff>>
  ): Promise<Entry<Staff> | undefined> {
    if (!search.id && !search.email && !search.name) return;
    const staffQuery = knex<Entry<Staff>>('staffs').select('*').first();
    if (search.id) {
      staffQuery.where({ id: search.id });
    }
    if (search.name) {
      staffQuery.where({ name: search.name });
    }
    if (search.email) {
      staffQuery.where({ email: search.email });
    }
    const staff = await staffQuery;
    return staff;
  }

  public async readAllShops(staffId: number) {
    const shops = await knex('shops_staffs')
      .innerJoin('shops', 'shops.id', 'shops_staffs.shop_id')
      .select('shops.*')
      .where({ 'shops_staffs.staff_id': staffId });
    return shops;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public validate(object: any): object is Staff {
    if (typeof object !== 'object') return false;
    if (typeof object['name'] !== 'string') return false;
    return true;
  }
}
