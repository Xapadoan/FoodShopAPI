import { Request, Response } from 'express';
import { IngredientsRepository, Ingredient } from '@repo/IngredientsRepository';
import { HTTPError, Pagination } from '@lib/http';
import { Entry } from '@repo/Repository';

export const readAll = async (
  req: Request<unknown, unknown, unknown, { name: string; page: number }>,
  res: Response<Pagination<Entry<Ingredient>> | HTTPError>
) => {
  try {
    const { name, page } = req.query;
    const repository = new IngredientsRepository();
    const results = await repository.list({
      name,
      page,
    });
    return res.json({
      page,
      length: results.length,
      results,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unknown server error' });
  }
};
