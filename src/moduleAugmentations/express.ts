import 'express';
import { Entry } from '@repo/Repository';
import { Staff } from '@repo/StaffRepository';

declare module 'express' {
  export interface Request {
    staff?: Entry<Staff>;
  }
}
