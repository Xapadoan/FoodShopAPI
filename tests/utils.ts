import { Entry } from '@repo/Repository';
import { Staff } from '@repo/StaffsRepository';

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
