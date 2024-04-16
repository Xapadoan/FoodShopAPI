import { expectResolved, validShopEntry, validShop } from '../utils';

const mockKnexInsert = jest.fn().mockResolvedValue([validShopEntry.id]);
const mockKnexSelect = jest.fn().mockReturnThis();
const mockKnexFirst = jest.fn().mockResolvedValue(validShopEntry);
const mockKnexWhere = jest.fn().mockReturnThis();
const mockKnexInnerJoin = jest.fn().mockReturnThis();
const mockKnex = jest.fn(() => ({
  insert: mockKnexInsert,
  select: mockKnexSelect,
  where: mockKnexWhere,
  first: mockKnexFirst,
  innerJoin: mockKnexInnerJoin,
}));

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
    const shop = await repository.read({ id: validShopEntry.id });
    expect(mockKnex).toHaveBeenCalledWith('shops');
    expect(mockKnexSelect).toHaveBeenCalled();
    expect(mockKnexWhere).toHaveBeenCalledWith({ id: validShopEntry.id });
    expect(mockKnexFirst).toHaveBeenCalled();
    expectResolved(mockKnexFirst).toMatchObject(validShopEntry);
    expect(shop).toMatchObject(validShopEntry);
  });

  it('should be able to read by name', async () => {
    const shop = await repository.read({ name: validShop.name });
    expect(mockKnex).toHaveBeenCalledWith('shops');
    expect(mockKnexSelect).toHaveBeenCalled();
    expect(mockKnexWhere).toHaveBeenCalledWith({ name: validShop.name });
    expect(mockKnexFirst).toHaveBeenCalled();
    expectResolved(mockKnexFirst).toMatchObject(validShopEntry);
    expect(shop).toMatchObject(validShopEntry);
  });

  it('should return undefined when no search is provided to read', async () => {
    const shop = await repository.read({});
    expect(mockKnex).not.toHaveBeenCalled();
    expect(shop).toBeUndefined();
  });

  it('should return undefined when reading a non-existing shop', async () => {
    mockKnexFirst.mockResolvedValueOnce(undefined);
    const shop = await repository.read({ id: 42 });
    expect(mockKnex).toHaveBeenCalledWith('shops');
    expect(mockKnexSelect).toHaveBeenCalled();
    expect(mockKnexWhere).toHaveBeenCalledWith({ id: 42 });
    expect(mockKnexFirst).toHaveBeenCalled();
    expectResolved(mockKnexFirst).toBeUndefined();
    expect(shop).toBeUndefined();
  });

  it('should be able to create a shop', async () => {
    const shop = await repository.create(validShop);
    expect(mockKnex).toHaveBeenCalledWith('shops');
    expect(mockKnexInsert).toHaveBeenCalledWith(validShop);
    expectResolved(mockKnexInsert).toEqual([validShopEntry.id]);
    expect(shop).toMatchObject(validShopEntry);
  });
});
