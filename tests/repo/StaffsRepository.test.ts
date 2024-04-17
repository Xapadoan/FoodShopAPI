import { createTracker, MockClient, Tracker } from 'knex-mock-client';
import Knex from 'knex';
import knex from '../../src/data';

jest.mock('../../src/data', () => Knex({ client: MockClient }));

import { validStaff, validStaffEntry } from '../utils';
import { Repository } from '@repo/Repository';
import { StaffsRepository } from '@repo/StaffsRepository';

describe('Staffs Repository', () => {
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
  const repository = new StaffsRepository();

  it('should be a repository', () => {
    expect(repository).toBeInstanceOf(Repository);
  });

  it('should have accurate validation', () => {
    expect(repository.validate('Hello !')).toBeFalsy();
    expect(repository.validate({})).toBeFalsy();
    expect(repository.validate({ name: validStaff.name })).toBeFalsy();
    expect(repository.validate({ email: validStaff.email })).toBeFalsy();
    expect(repository.validate(validStaff)).toBeTruthy();
  });

  it('should be able to create a new staff', async () => {
    dbTracker.on.insert('staffs').response([validStaffEntry.id]);
    const newStaff = await repository.create(validStaff);
    expect(newStaff).toMatchObject(validStaff);

    const insertHistory = dbTracker.history.insert;
    expect(insertHistory.length).toEqual(1);
    expect(insertHistory[0].method).toEqual('insert');
    expect(insertHistory[0].bindings).toContainEqual(validStaff.name);
    expect(insertHistory[0].bindings).toContainEqual(validStaff.email);
  });

  it('should be able to read an existing staff by id', async () => {
    dbTracker.on.select('staffs').response(validStaffEntry);
    const foundStaff = await repository.read({ id: validStaffEntry.id });
    expect(foundStaff).toMatchObject(validStaff);

    const selectHistory = dbTracker.history.select;
    expect(selectHistory.length).toEqual(1);
    expect(selectHistory[0].method).toEqual('select');
    expect(selectHistory[0].bindings).toContainEqual(validStaffEntry.id);
  });

  it('should be able to read an existing staff by name', async () => {
    dbTracker.on.select('staffs').response(validStaffEntry);
    const foundStaff = await repository.read({ name: validStaff.name });
    expect(foundStaff).toMatchObject(validStaff);

    const selectHistory = dbTracker.history.select;
    expect(selectHistory.length).toEqual(1);
    expect(selectHistory[0].method).toEqual('select');
    expect(selectHistory[0].bindings).toContainEqual(validStaff.name);
  });

  it('should be able to read an existing staff by email', async () => {
    dbTracker.on.select('staffs').response(validStaffEntry);
    const foundStaff = await repository.read({ email: validStaff.email });
    expect(foundStaff).toMatchObject(validStaff);

    const selectHistory = dbTracker.history.select;
    expect(selectHistory.length).toEqual(1);
    expect(selectHistory[0].method).toEqual('select');
    expect(selectHistory[0].bindings).toContainEqual(validStaff.email);
  });

  it('should return undefined when reading with no params', async () => {
    dbTracker.on.select('staffs').response(validStaffEntry);
    const foundStaff = await repository.read({});
    expect(foundStaff).toBeUndefined();

    const selectHistory = dbTracker.history.select;
    expect(selectHistory.length).toEqual(0);
  });
});
