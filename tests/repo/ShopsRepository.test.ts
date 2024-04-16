import {
  expectResolved,
  validShopEntry,
  validShop,
  validStaffEntry,
} from '../utils';

const qb = {
  insert: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  first: jest.fn().mockReturnThis(),
  innerJoin: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
};
const mockKnex = jest.fn().mockReturnValue(qb);

jest.mock('knex', () => jest.fn(() => mockKnex));

import { ShopsRepository } from '../../src/repo/ShopsRepository';
import { Repository } from '../../src/repo/Repository';

describe('Shops Repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetModules();
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
    qb.first.mockResolvedValueOnce(validShopEntry);
    const shop = await repository.read({ id: validShopEntry.id });
    expect(mockKnex).toHaveBeenCalledWith('shops');
    expect(qb.select).toHaveBeenCalled();
    expect(qb.where).toHaveBeenCalledWith({ id: validShopEntry.id });
    expect(qb.first).toHaveBeenCalled();
    expectResolved(qb.first).toMatchObject(validShopEntry);
    expect(shop).toMatchObject(validShopEntry);
  });

  it('should be able to read by name', async () => {
    qb.first.mockResolvedValueOnce(validShopEntry);
    const shop = await repository.read({ name: validShop.name });
    expect(mockKnex).toHaveBeenCalledWith('shops');
    expect(qb.select).toHaveBeenCalled();
    expect(qb.where).toHaveBeenCalledWith({ name: validShop.name });
    expect(qb.first).toHaveBeenCalled();
    expectResolved(qb.first).toMatchObject(validShopEntry);
    expect(shop).toMatchObject(validShopEntry);
  });

  it('should return undefined when no search is provided to read', async () => {
    const shop = await repository.read({});
    expect(mockKnex).not.toHaveBeenCalled();
    expect(shop).toBeUndefined();
  });

  it('should return undefined when reading a non-existing shop', async () => {
    qb.first.mockResolvedValueOnce(undefined);
    const shop = await repository.read({ id: 42 });
    expect(mockKnex).toHaveBeenCalledWith('shops');
    expect(qb.select).toHaveBeenCalled();
    expect(qb.where).toHaveBeenCalledWith({ id: 42 });
    expect(qb.first).toHaveBeenCalled();
    expectResolved(qb.first).toBeUndefined();
    expect(shop).toBeUndefined();
  });

  it('should be able to create a shop', async () => {
    qb.insert.mockResolvedValueOnce([validShopEntry.id]);
    const shop = await repository.create(validShop);
    expect(mockKnex).toHaveBeenCalledWith('shops');
    expect(qb.insert).toHaveBeenCalledWith(validShop);
    expectResolved(qb.insert).toEqual([validShopEntry.id]);
    expect(shop).toMatchObject(validShopEntry);
  });

  it('should be able to list the shops involving a certain staff', async () => {
    qb.limit.mockResolvedValueOnce([validShopEntry]);
    const shops = await repository.listStaffShops(
      validStaffEntry.id,
      { name: '' },
      0
    );
    expect(mockKnex).toHaveBeenCalledWith('shops');
    expect(qb.innerJoin).toHaveBeenCalledWith(
      'shops_staffs',
      'shops.id',
      'shops_staffs.shop_id'
    );
    expect(qb.select).toHaveBeenCalled();
    expect(qb.where).toHaveBeenCalledTimes(2);
    expectResolved(qb.limit).toEqual([validShopEntry]);
    expect(shops).toEqual([validShopEntry]);
  });
});
