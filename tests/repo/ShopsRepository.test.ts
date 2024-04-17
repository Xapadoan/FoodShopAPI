import { createTracker, MockClient, Tracker } from 'knex-mock-client';
import Knex from 'knex';
import knex from '../../src/data';

jest.mock('../../src/data', () => Knex({ client: MockClient }));
import { validShopEntry, validShop, validStaffEntry } from '../utils';
import { ShopsRepository } from '../../src/repo/ShopsRepository';
import { Repository } from '../../src/repo/Repository';

describe('Shops Repository', () => {
  let dbTracker: Tracker;
  beforeAll(() => {
    dbTracker = createTracker(knex);
  });
  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });
  afterEach(() => {
    dbTracker.reset();
    jest.clearAllMocks();
  });

  const repository = new ShopsRepository();
  it('should be a repository', () => {
    expect(repository instanceof Repository).toBeTruthy();
  });

  it('should have accurate validation', () => {
    expect(repository.validate('Hello !')).toBeFalsy();
    expect(repository.validate({})).toBeFalsy();
    expect(repository.validate({ name: validShop.name })).toBeFalsy();
    expect(repository.validate({ ...validShop, name: 'asd' })).toBeFalsy();
    expect(repository.validate({ address: validShop.address })).toBeFalsy();
    expect(repository.validate({ ...validShop, address: 'asd' })).toBeFalsy();
    expect(repository.validate(validShop)).toBeTruthy();
  });

  it('should be able to read by id', async () => {
    dbTracker.on.select('shops').response(validShopEntry);
    const shop = await repository.read({ id: validShopEntry.id });
    expect(shop).toMatchObject(validShopEntry);

    const selectHistory = dbTracker.history.select;
    expect(selectHistory.length).toEqual(1);
    expect(selectHistory[0].method).toEqual('select');
    expect(selectHistory[0].bindings).toContainEqual(validShopEntry.id);
  });

  it('should be able to read by name', async () => {
    dbTracker.on.select('shops').response(validShopEntry);
    const shop = await repository.read({ name: validShop.name });
    expect(shop).toMatchObject(validShopEntry);

    const selectHistory = dbTracker.history.select;
    expect(selectHistory.length).toEqual(1);
    expect(selectHistory[0].method).toEqual('select');
    expect(selectHistory[0].bindings).toContainEqual(validShopEntry.id);
  });

  it('should return undefined when no search is provided to read', async () => {
    const shop = await repository.read({});
    expect(shop).toBeUndefined();

    const selectHistory = dbTracker.history.select;
    expect(selectHistory.length).toEqual(0);
  });

  it('should return undefined when reading a non-existing shop', async () => {
    dbTracker.on.select('shops').response(undefined);
    const shop = await repository.read({ id: 42 });
    expect(shop).toBeUndefined();

    const selectHistory = dbTracker.history.select;
    expect(selectHistory.length).toEqual(1);
    expect(selectHistory[0].method).toEqual('select');
    expect(selectHistory[0].bindings).toContainEqual(validShopEntry.id);
  });

  it('should be able to create a shop', async () => {
    dbTracker.on.insert('shops').response([validShopEntry.id]);
    const shop = await repository.create(validShop);
    expect(shop).toMatchObject(validShopEntry);

    const insertHistory = dbTracker.history.insert;
    expect(insertHistory.length).toEqual(1);
    expect(insertHistory[0].method).toEqual('insert');
    expect(insertHistory[0].bindings).toContainEqual(validShop.name);
    expect(insertHistory[0].bindings).toContainEqual(validShop.address);
  });

  it('should be able to link a staff to a shop', async () => {
    dbTracker.on.insert('shops_staffs').response([1]);
    await repository.addStaff(validShopEntry.id, validStaffEntry.id);

    const insertHistory = dbTracker.history.insert;
    expect(insertHistory.length).toEqual(1);
    expect(insertHistory[0].method).toEqual('insert');
    expect(insertHistory[0].bindings).toContainEqual(validShopEntry.id);
    expect(insertHistory[0].bindings).toContainEqual(validStaffEntry.id);
  });

  it('should be able to list the shops involving a certain staff', async () => {
    dbTracker.on.select('shops').response([validShopEntry]);
    const shops = await repository.listStaffShops(
      validStaffEntry.id,
      { name: '' },
      0
    );
    expect(shops).toEqual([validShopEntry]);

    const selectHistory = dbTracker.history.select;
    expect(selectHistory.length).toEqual(1);
    expect(selectHistory[0].method).toEqual('select');
    expect(selectHistory[0].sql.includes('shops_staffs')).toBeTruthy();
    expect(
      selectHistory[0].sql.toLowerCase().includes('inner join')
    ).toBeTruthy();
    expect(selectHistory[0].bindings).toContainEqual(validStaffEntry.id);
  });

  it('should be able to read a shop for a given staff', async () => {
    dbTracker.on.select('shops').response(validShopEntry);
    const shop = await repository.readStaffShop(
      validStaffEntry.id,
      validShopEntry.id
    );
    expect(shop).toMatchObject(validShopEntry);

    const selectHistory = dbTracker.history.select;
    expect(selectHistory.length).toEqual(1);
    expect(selectHistory[0].method).toEqual('select');
    expect(selectHistory[0].sql.includes('shops_staffs')).toBeTruthy();
    expect(
      selectHistory[0].sql.toLowerCase().includes('inner join')
    ).toBeTruthy();
    expect(selectHistory[0].bindings).toContainEqual(validStaffEntry.id);
    expect(selectHistory[0].bindings).toContainEqual(validShopEntry.id);
  });
});
