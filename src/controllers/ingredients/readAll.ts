import { Request, Response } from 'express';
import { IngredientsRepository, Ingredient } from '@repo/IngredientsRepository';
import { HTTPError, Pagination } from '@lib/http';
import { Entry } from '@repo/Repository';

const validate = ({ name, page }: { name: unknown; page: unknown }) => {
  if (page && Number.isNaN(Number(page))) return false;
  if (name && Array.isArray(name)) return false;
  return { name: String(name || ''), page: Number(page || 0) };
};

export const readAll = async (
  req: Request<unknown, unknown, unknown, { name: unknown; page: unknown }>,
  res: Response<Pagination<Entry<Ingredient>> | HTTPError>
) => {
  try {
    const validQuery = validate(req.query);
    if (!validQuery) {
      return res.status(400).json({ error: 'Bad query' });
    }
    const { name, page } = validQuery;
    const repository = new IngredientsRepository();
    const results = await repository.list({ name }, page);
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
