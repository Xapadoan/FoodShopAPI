import 'express';
import { Entry } from '@repo/Repository';
import { Staff } from '@repo/StaffsRepository';

declare module 'express' {
  export interface Request {
    staff?: Entry<Staff>;
  }
}
