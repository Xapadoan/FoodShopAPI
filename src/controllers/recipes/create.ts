import { HTTPError } from '@lib/http';
import { IngredientsRepository } from '@repo/IngredientsRepository';
import { Recipe, RecipesRepository } from '@repo/RecipesRepository';
import { Entry } from '@repo/Repository';
import { Request, Response } from 'express';

export const create = async (
  req: Request<unknown, unknown, Recipe>,
  res: Response<Entry<Recipe> | HTTPError>
) => {
  try {
    const repository = new RecipesRepository();
    if (!repository.validate(req.body)) {
      return res.status(400).json({ error: 'Bad Params' });
    }
    const validIngredients = await new IngredientsRepository().checkExistence(
      req.body.ingredients.map(({ id }) => id)
    );
    if (!validIngredients) {
      return res.status(400).json({ error: 'Some ingredients do not exist' });
    }
    const created = await repository.create(req.body);
    return res.status(201).json(created);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unknown server error' });
  }
};
