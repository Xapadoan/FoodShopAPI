import type { Request, Response, NextFunction } from 'express';
import '../../../src/moduleAugmentations/express';
import { validShopEntry } from '../../utils';

export const publicShopMiddlewareMock = jest.fn(
  <T = unknown>(req: Request<T>, _: Response, next: NextFunction) => {
    req.shop = validShopEntry;
    return next();
  }
);
