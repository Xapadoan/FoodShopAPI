import { Entry, Repository } from '@repo/Repository';
import knex from '../data';

export type Staff = {
  name: string;
  email: string;
};

export class StaffsRepository extends Repository<Staff> {
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
    const staffQuery = knex<Entry<Staff>>('staffs').select('*');
    if (search.id) {
      staffQuery.where({ id: search.id });
    }
    if (search.name) {
      staffQuery.where({ name: search.name });
    }
    if (search.email) {
      staffQuery.where({ email: search.email });
    }
    const staff = await staffQuery.first();
    return staff;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public validate(object: any): object is Staff {
    if (typeof object !== 'object') return false;
    if (typeof object['name'] !== 'string') return false;
    if (typeof object['email'] !== 'string') return false;
    return true;
  }
}
