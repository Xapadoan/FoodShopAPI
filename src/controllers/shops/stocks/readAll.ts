import { HTTPError, Pagination } from '@lib/http';
import { Stock, StocksRepository } from '@repo/StocksRepository';
import { Request, Response } from 'express';

type ValidQuery = {
  page: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validate = (query: any): ValidQuery | false => {
  if (query.page && Number.isNaN(Number(query.page))) return false;
  return { page: Number(query.page || 0) };
};

export const readAll = async (
  req: Request,
  res: Response<HTTPError | Pagination<Stock>>
) => {
  try {
    if (!req.shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    const validQuery = validate(req.query);
    if (!validQuery) {
      return res.status(400).json({ error: 'Bad Query' });
    }
    const stocksRepo = new StocksRepository();
    const stocks = await stocksRepo.list(
      { shopId: req.shop.id },
      validQuery.page
    );
    return res.json({
      page: validQuery.page,
      length: stocks.length,
      results: stocks,
    });
  } catch (err) {
    console.error('Failed to list stocks: ', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
};
