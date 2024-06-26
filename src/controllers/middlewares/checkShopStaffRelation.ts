import { ShopsRepository } from '@repo/ShopsRepository';
import { NextFunction, Request, Response } from 'express';

export async function checkShopStaffRelation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.staff) {
      return res.status(401).json({ error: 'Missing Authentication' });
    }
    const shopId = Number(req.params.shopId);
    if (!Number.isInteger(shopId)) {
      return res.status(400).json({ error: 'shopId must be an integer' });
    }
    const shopsRepo = new ShopsRepository();
    const shop = await shopsRepo.readStaffShop(req.staff.id, shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    req.shop = shop;
    return next();
  } catch (error) {
    console.error('Failed to check shop-staff relation', error);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
