import knex from '../../src/data';
import { ShopsRepository } from '../../src/repo/ShopsRepository';
import { Repository } from '../../src/repo/Repository';
import { values as allShops } from '../seeds/shops';

const validShop = {
  name: 'Fresh Veggies',
  address: '4 main street 93100 Gotham',
};

const validStaff = {
  name: 'Guliver',
  apiKey: '123-123-123',
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

  it('should have accurate validation for staff', () => {
    expect(repository.validateStaff('Hello !')).toBeFalsy();
    expect(repository.validateStaff({})).toBeFalsy();
    expect(repository.validateStaff({ name: validStaff.name })).toBeFalsy();
    expect(repository.validateStaff({ apiKey: validStaff.apiKey })).toBeFalsy();
    expect(repository.validateStaff(validStaff)).toBeTruthy();
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

  it('should be able to create a shop along with staff', async () => {
    const created = await repository.createWithStaff({
      shop: validShop,
      staff: { name: 'Oliver', apiKey: '123-321' },
    });
    expect(repository.validate(created.shop)).toBeTruthy();
    expect(typeof created.shop.id).toEqual('number');
    expect(repository.validateStaff(created.staff)).toBeTruthy();
    expect(typeof created.staff.id).toEqual('number');
  });

  it('should be able to read a shop after its creation', async () => {
    const shop = await repository.read({ name: validShop.name });
    expect(shop).toBeTruthy();
  });
});
