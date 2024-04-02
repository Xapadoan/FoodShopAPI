import { expectResolved, validStaff, validStaffEntry } from '../utils';

const mockKnexInsert = jest.fn().mockResolvedValue([validStaffEntry.id]);
const mockKnexSelect = jest.fn().mockReturnThis();
const mockKnexFirst = jest.fn().mockResolvedValue(validStaffEntry);
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

import { Repository } from '@repo/Repository';
import { StaffsRepository } from '@repo/StaffsRepository';

describe('Staffs Repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetModules();
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
    const newStaff = await repository.create(validStaff);
    expect(mockKnex).toHaveBeenCalledWith('staffs');
    expect(mockKnexInsert).toHaveBeenCalledWith(validStaff);
    expectResolved(mockKnexInsert).toEqual([validStaffEntry.id]);
    expect(newStaff).toMatchObject(validStaff);
  });

  it('should be able to read an existing staff by id', async () => {
    const foundStaff = await repository.read({ id: validStaffEntry.id });
    expect(mockKnex).toHaveBeenCalledWith('staffs');
    expect(mockKnexSelect).toHaveBeenCalled();
    expect(mockKnexWhere).toHaveBeenCalledTimes(1);
    expect(mockKnexWhere).toHaveBeenCalledWith({ id: validStaffEntry.id });
    expectResolved(mockKnexFirst).toMatchObject(validStaffEntry);
    expect(foundStaff).toMatchObject(validStaff);
  });

  it('should be able to read an existing staff by name', async () => {
    const foundStaff = await repository.read({ name: validStaff.name });
    expect(mockKnex).toHaveBeenCalledWith('staffs');
    expect(mockKnexSelect).toHaveBeenCalled();
    expect(mockKnexWhere).toHaveBeenCalledTimes(1);
    expect(mockKnexWhere).toHaveBeenCalledWith({ name: validStaff.name });
    expectResolved(mockKnexFirst).toMatchObject(validStaffEntry);
    expect(foundStaff).toMatchObject(validStaff);
  });

  it('should be able to read an existing staff by email', async () => {
    const foundStaff = await repository.read({ email: validStaff.email });
    expect(mockKnex).toHaveBeenCalledWith('staffs');
    expect(mockKnexSelect).toHaveBeenCalled();
    expect(mockKnexWhere).toHaveBeenCalledTimes(1);
    expect(mockKnexWhere).toHaveBeenCalledWith({ email: validStaff.email });
    expectResolved(mockKnexFirst).toMatchObject(validStaffEntry);
    expect(foundStaff).toMatchObject(validStaff);
  });

  it('should return undefined when reading with no params', async () => {
    const foundStaff = await repository.read({});
    expect(mockKnex).not.toHaveBeenCalled();
    expect(foundStaff).toBeUndefined();
  });

  it("should ba able to list a staff's shops", async () => {
    mockKnexWhere.mockResolvedValueOnce([]);
    const shops = await repository.readAllShops(validStaffEntry.id);
    expect(mockKnex).toHaveBeenCalledWith('shops_staffs');
    expect(mockKnexInnerJoin).toHaveBeenCalledWith(
      'shops',
      'shops.id',
      'shops_staffs.shop_id'
    );
    expect(mockKnexSelect).toHaveBeenCalledWith('shops.*');
    expect(mockKnexWhere).toHaveBeenCalledWith({
      'shops_staffs.staff_id': validStaffEntry.id,
    });
    expectResolved(mockKnexWhere).toEqual([]);
    expect(shops).toEqual([]);
  });
});
