import { ShopsRepository } from '@repo/ShopsRepository';
import { NextFunction, Request, Response } from 'express';

export async function publicShop(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const shopId = Number(req.params.shopId);
  if (!Number.isInteger(shopId)) {
    return res.status(400).json({ error: 'shopId must be an integer' });
  }
  const shopsRepo = new ShopsRepository();
  const shop = await shopsRepo.read({ id: shopId });
  if (!shop) {
    return res.status(404).json({ error: 'Shop not found' });
  }
  req.shop = shop;
  return next();
}
