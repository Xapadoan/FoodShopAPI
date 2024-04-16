import { Entry } from '@repo/Repository';
import { Staff } from '@repo/StaffsRepository';
import { Shop } from '@repo/ShopsRepository';

export function expectResolved(spy: jest.SpyInstance) {
  return expect(spy.mock.results[0]?.value).resolves;
}

export function expectNthResolved(spy: jest.SpyInstance, n: number) {
  return expect(spy.mock.results[n - 1]?.value).resolves;
}

export const validStaff: Staff = {
  name: 'Geordy Laforge',
  email: 'geordy@engineering.fed',
};

export const validStaffEntry: Entry<Staff> = {
  ...validStaff,
  id: 1,
};

export const validShop: Shop = {
  name: 'La Cantina',
  address: '5th Federation Avenue NY City',
};

export const validShopEntry: Entry<Shop> = {
  ...validShop,
  id: 1,
};
