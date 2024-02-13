import { Request, Response } from 'express';
import { IngredientsRepository, Ingredient } from '@repo/IngredientsRepository';
import { Entry } from '@repo/Repository';
import { HTTPError } from '@lib/http';

function validate({ id }: { id: unknown }) {
  const asNumber = Number(id);
  if (Number.isNaN(asNumber)) return false;
  return { id: asNumber };
}

export const read = async (
  req: Request<{ id: number }>,
  res: Response<Entry<Ingredient> | HTTPError>
) => {
  try {
    const validQuery = validate(req.params);
    if (!validQuery) {
      return res.status(400).json({ error: 'Bad Param' });
    }
    const { id } = validQuery;
    const repository = new IngredientsRepository();
    const results = await repository.read({ id });
    if (!results) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unknown server error' });
  }
};
