import knex from '../../src/data';
import { ShopsRepository } from '../../src/repo/ShopsRepository';
import { Repository } from '../../src/repo/Repository';
import { values as allShops } from '../seeds/shops';

const validShop = {
  name: 'Fresh Veggies',
  address: '4 main street 93100 Gotham',
};

describe('Shops Repository', () => {
  beforeAll(async () => {
    await knex.seed.run();
  });

  const repository = new ShopsRepository();
  it('should be a repository', () => {
    expect(repository instanceof Repository).toBeTruthy();
  });

  it('should have accurate validation', () => {
    expect(repository.validate('Hello !')).toBeFalsy();
    expect(repository.validate({})).toBeFalsy();
    expect(repository.validate({ name: validShop.name })).toBeFalsy();
    expect(repository.validate({ address: validShop.address })).toBeFalsy();
    expect(repository.validate(validShop)).toBeTruthy();
  });

  it('should be able to read by id', async () => {
    const shop = await repository.read({ id: allShops[0].id });
    expect(shop).toBeTruthy();
    expect(shop).toMatchObject(allShops[0]);
  });

  it('should be able to read by name', async () => {
    const shop = await repository.read({ name: allShops[0].name });
    expect(shop).toBeTruthy();
    expect(shop).toMatchObject(allShops[0]);
  });

  it('should return undefined when no search is provided to read', async () => {
    const shop = await repository.read({});
    expect(shop).toBeUndefined();
  });

  it('should return undefined when reading a non-existing shop', async () => {
    const shop = await repository.read({ id: 42 });
    expect(shop).toBeUndefined();
  });
});
