import { Request, Response } from 'express';
import { Entry } from '@repo/Repository';
import { Ingredient, IngredientsRepository } from '@repo/IngredientsRepository';
import { HTTPError } from '@lib/http';

export const create = async (
  req: Request<unknown, unknown, Ingredient>,
  res: Response<Entry<Ingredient> | HTTPError>
) => {
  try {
    const repository = new IngredientsRepository();
    if (!repository.validate(req.body)) {
      return res.status(400).json({ error: 'Bad Params' });
    }
    const created = await repository.create(req.body);
    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
};
