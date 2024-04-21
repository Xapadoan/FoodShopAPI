import type { Request, Response, NextFunction } from 'express';
import '../../../src/moduleAugmentations/express';
import { validShopEntry } from '../../utils';

export const checkShopStaffRelationMock = jest.fn(
  <P = unknown>(req: Request<P>, _: Response, next: NextFunction) => {
    req.shop = validShopEntry;
    return next();
  }
);
