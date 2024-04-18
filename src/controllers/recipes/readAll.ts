import { Request, Response } from 'express';
import { RecipesRepository, RecipePreview } from '@repo/RecipesRepository';
import { HTTPError, Pagination } from '@lib/http';

const validate = ({ name, page }: { name: unknown; page: unknown }) => {
  if (page && Number.isNaN(Number(page))) return false;
  if (name && Array.isArray(name)) return false;
  return { name: String(name || ''), page: Number(page || 0) };
};

export const readAll = async (
  req: Request<unknown, unknown, unknown, { name: unknown; page: unknown }>,
  res: Response<Pagination<RecipePreview> | HTTPError>
) => {
  try {
    const validQuery = validate(req.query);
    if (!validQuery) {
      return res.status(400).json({ error: 'Bad query' });
    }
    const { name, page } = validQuery;
    const repository = new RecipesRepository();
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
