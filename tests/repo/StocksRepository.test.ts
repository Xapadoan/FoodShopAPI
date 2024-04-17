import { createTracker, MockClient, Tracker } from 'knex-mock-client';
import Knex from 'knex';
import knex from '../../src/data';

jest.mock('../../src/data', () => Knex({ client: MockClient }));

import { validStockEntry, validStock } from '../utils';
import { StocksRepository } from '@repo/StocksRepository';
import { Repository } from '@repo/Repository';

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

  const repository = new StocksRepository();
  it('should be a repository', () => {
    expect(repository instanceof Repository).toBeTruthy();
  });

  it('should have accurate validation', () => {
    expect(repository.validate('Hello !')).toBeFalsy();
    expect(repository.validate({})).toBeFalsy();
    expect(
      repository.validate({ ingredientId: validStock.ingredientId })
    ).toBeFalsy();
    expect(
      repository.validate({
        ingredientId: validStock.ingredientId,
        quantity: validStock.quantity,
      })
    ).toBeFalsy();
    expect(
      repository.validate({
        ingredientId: validStock.ingredientId,
        quantity: validStock.quantity,
        unitPrice: validStock.unitPrice,
      })
    ).toBeFalsy();
    expect(repository.validate(validStock)).toBeTruthy();
  });

  it('should be able to create a new stock', async () => {
    dbTracker.on.select('stocks').response(undefined);
    dbTracker.on.insert('stocks').response([validStockEntry.id]);
    const stock = await repository.create(validStock);
    expect(stock).toMatchObject(validStockEntry);

    const selectHistory = dbTracker.history.select;
    expect(selectHistory.length).toEqual(1);
    expect(selectHistory[0].method).toEqual('select');
    expect(selectHistory[0].bindings).toContainEqual(validStock.shopId);
    expect(selectHistory[0].bindings).toContainEqual(validStock.ingredientId);

    const insertHistory = dbTracker.history.insert;
    expect(insertHistory.length).toEqual(1);
    expect(insertHistory[0].method).toEqual('insert');
    expect(insertHistory[0].bindings).toContainEqual(validStock.shopId);
    expect(insertHistory[0].bindings).toContainEqual(validStock.ingredientId);
    expect(insertHistory[0].bindings).toContainEqual(validStock.quantity);
    expect(insertHistory[0].bindings).toContainEqual(
      validStock.unitPrice * 100
    );
  });

  it('should not create a new entry when the stock is already defined', async () => {
    dbTracker.on.select('stocks').response(validStockEntry);
    dbTracker.on.insert('stocks').simulateError('Duplicate Entry');
    const stock = await repository.create(validStock);
    expect(stock).toMatchObject(validStockEntry);

    const selectHistory = dbTracker.history.select;
    expect(selectHistory.length).toEqual(1);
    expect(selectHistory[0].method).toEqual('select');
    expect(selectHistory[0].bindings).toContainEqual(validStock.shopId);
    expect(selectHistory[0].bindings).toContainEqual(validStock.ingredientId);

    const insertHistory = dbTracker.history.insert;
    expect(insertHistory.length).toEqual(0);
  });

  it('should be able to update an existing entry', async () => {
    const updatedStock = { quantity: 42 };
    const updatedStockEntry = { ...validStockEntry, quantity: 42 };
    dbTracker.on.update('stocks').response(undefined);
    dbTracker.on.select('stocks').response(updatedStockEntry);
    const stock = await repository.update(validStockEntry.id, updatedStock);
    expect(stock).toMatchObject(updatedStockEntry);

    const updateHistory = dbTracker.history.update;
    expect(updateHistory.length).toEqual(1);
    expect(updateHistory[0].method).toEqual('update');
    expect(updateHistory[0].bindings).toContainEqual(validStockEntry.id);
    expect(updateHistory[0].bindings).toContainEqual(42);
    expect(
      updateHistory[0].sql.toLowerCase().indexOf('updated_at')
    ).not.toEqual(-1);
    expect(updateHistory[0].sql.toLowerCase().indexOf('now()')).not.toEqual(-1);

    const selectHistory = dbTracker.history.select;
    expect(selectHistory.length).toEqual(1);
    expect(selectHistory[0].method).toEqual('select');
    expect(selectHistory[0].bindings).toContainEqual(validStockEntry.id);
  });
});
