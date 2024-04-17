import { HTTPError } from '@lib/http';
import { Entry } from '@repo/Repository';
import { Stock, StocksRepository } from '@repo/StocksRepository';
import { Request, Response } from 'express';

export const update = async (
  req: Request<{ shopId: number; stockId: number }>,
  res: Response<HTTPError | Entry<Stock>>
) => {
  try {
    const stockId = Number(req.params.stockId);
    if (!Number.isInteger(stockId)) {
      return res.status(400).json({ error: 'stockId must be an integer' });
    }
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
      quantity: Number(req.body.unitPrice),
    };
    if (!stocksRepo.validate(body)) {
      return res.status(400).json({ error: 'Bad Stock' });
    }
    const stock = await stocksRepo.update(stockId, {
      ...req.body,
      shopId: req.shop.id,
    });
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    return res.json(stock);
  } catch (err) {
    console.error('Failed to update stocks: ', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
};
