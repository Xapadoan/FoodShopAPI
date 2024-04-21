import { HTTPError } from '@lib/http';
import { Entry } from '@repo/Repository';
import { Stock, StocksRepository } from '@repo/StocksRepository';
import { Request, Response } from 'express';

export const create = async (
  req: Request<{ shopId: number }>,
  res: Response<HTTPError | Entry<Stock>>
) => {
  try {
    if (!req.staff) {
      return res.status(401).json({ error: 'Missing Authentication' });
    }
    if (!req.shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    const stocksRepo = new StocksRepository();
    const body = {
      ...req.body,
      unitPrice: Number(req.body.unitPrice),
      quantity: Number(req.body.quantity),
    };
    if (!stocksRepo.validate(body)) {
      return res.status(400).json({ error: 'Bad Stock' });
    }
    const stock = await stocksRepo.create({ ...body, shopId: req.shop.id });
    return res.status(201).json(stock);
  } catch (err) {
    console.error('Failed to create stock: ', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
};
