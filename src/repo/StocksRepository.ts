import knex from '../data';
import { Repository, Entry } from './Repository';

export type Stock = {
  shopId: number;
  ingredientId: number;
  quantity: number;
  unitPrice: number;
};

export class StocksRepository extends Repository<Stock> {
  protected pageLength = 100;

  public async create(stock: Stock): Promise<Entry<Stock>> {
    const createdStock = await knex.transaction(async (trx) => {
      const existing = await trx('stocks')
        .select(
          'id',
          'shop_id AS shopId',
          'ingredient_id AS ingredientId',
          'quantity',
          knex.raw('unit_price / 100 AS unitPrice'),
          'created_at',
          'updated_at'
        )
        .where({ shop_id: stock.shopId, ingredient_id: stock.ingredientId })
        .first();
      if (existing) {
        return existing;
      }
      const [id] = await trx('stocks').insert({
        shop_id: stock.shopId,
        ingredient_id: stock.ingredientId,
        quantity: stock.quantity,
        unit_price: stock.unitPrice * 100,
      });
      return {
        id,
        ...stock,
      };
    });
    return createdStock;
  }

  public async update(
    id: number,
    { unitPrice, quantity }: Partial<Stock>
  ): Promise<Entry<Stock> | undefined> {
    await knex('stocks')
      .update({
        quantity,
        unit_price: unitPrice ? unitPrice * 100 : undefined,
        updated_at: knex.raw('NOW()'),
      })
      .where({ id });
    const updated = await knex<Entry<Stock>>('stocks')
      .select(
        'id',
        'shop_id AS shopId',
        'ingredient_id AS ingredientId',
        'quantity',
        knex.raw('unit_price / 100 AS unitPrice'),
        'created_at',
        'updated_at'
      )
      .where({ id })
      .first();
    return updated;
  }

  public async list(
    { shopId }: { shopId: number },
    page: number
  ): Promise<Entry<Stock>[]> {
    const stocks = await knex('stocks')
      .select(
        'id',
        'shop_id AS shopId',
        'ingredient_id AS ingredientId',
        'quantity',
        knex.raw('unit_price / 100 AS unitPrice'),
        'created_at',
        'updated_at'
      )
      .where({ shop_id: shopId })
      .offset(page * this.pageLength)
      .limit(this.pageLength);
    return stocks;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public validate(object: any): object is Stock {
    if (typeof object !== 'object') return false;
    if (typeof object['shopId'] !== 'number') return false;
    if (typeof object['ingredientId'] !== 'number') return false;
    if (typeof object['quantity'] !== 'number') return false;
    if (typeof object['unitPrice'] !== 'number') return false;
    return true;
  }
}
