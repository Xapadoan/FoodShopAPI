import type { Request, Response, NextFunction } from 'express';
import '../../../src/moduleAugmentations/express';
import { validStaffEntry } from '../../utils';

export const staffAuthMiddlewareMock = jest.fn(
  (req: Request, _: Response, next: NextFunction) => {
    req.staff = validStaffEntry;
    return next();
  }
);
