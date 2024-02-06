import { Repository } from '@repo/Repository';
import knex from 'src/data';

export type Recipe = {
  name: string;
  numberOfPeople: number;
  steps: Array<{ ranking: number; text: string }>;
  ingredients: {
    id: number;
    quantity: string;
  }[];
};

export class RecipesRepository extends Repository<Recipe> {
  protected pageLength = 50;

  public async create(recipe: Recipe) {
    const results = await knex.transaction(async (trx) => {
      const [id] = await trx('recipes').insert({
        name: recipe.name,
        nb_people: recipe.numberOfPeople,
      });
      await trx('steps').insert(
        recipe.steps.map((step) => ({
          recipe_id: id,
          ranking: step.ranking,
          text: step.text,
        }))
      );
      await trx('recipes_ingredients').insert(
        recipe.ingredients.map((ingredient) => ({
          recipe_id: id,
          ingredient_id: ingredient.id,
          quantity: ingredient.quantity,
        }))
      );
      return { id, ...recipe };
    });
    return results;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public validate(object: any): object is Recipe {
    if (typeof object !== 'object') return false;
    if (typeof object['name'] !== 'string') return false;
    if (typeof object['numberOfPeople'] !== 'number') return false;
    if (!Array.isArray(object['steps']) || object['steps'].length < 1)
      return false;
    if (typeof object['steps'][0] !== 'object') return false;
    if (typeof object['steps'][0]['ranking'] !== 'number') return false;
    if (typeof object['steps'][0]['text'] !== 'string') return false;
    if (
      !Array.isArray(object['ingredients']) ||
      object['ingredients'].length < 1
    )
      return false;
    if (typeof object['ingredients'][0] !== 'object') return false;
    if (typeof object['ingredients'][0]['id'] !== 'number') return false;
    if (typeof object['ingredients'][0]['quantity'] !== 'string') return false;
    return true;
  }
}
