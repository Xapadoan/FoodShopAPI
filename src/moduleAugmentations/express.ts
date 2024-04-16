import 'express';
import { Entry } from '@repo/Repository';
import { Staff } from '@repo/StaffsRepository';
import { Shop } from '@repo/ShopsRepository';

declare module 'express' {
  export interface Request {
    staff?: Entry<Staff>;
    shop?: Entry<Shop>;
  }
}
