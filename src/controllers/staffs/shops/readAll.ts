import { ShopsRepository } from '@repo/ShopsRepository';
import { Request, Response } from 'express';

type ValidQuery = {
  name: string;
  page: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validate = (query: any): ValidQuery | false => {
  if (query.page && Number.isNaN(Number(query.page))) return false;
  if (query.name && Array.isArray(query.name)) return false;
  return { name: String(query.name || ''), page: Number(query.page || 0) };
};

export async function readAll(req: Request, res: Response) {
  try {
    const validQuery = validate(req.query);
    if (!validQuery) {
      return res.status(400).json({ error: 'Bad query' });
    }
    if (!req.staff) {
      return res.status(401).json({ error: 'Missing Authentication' });
    }
    const shopsRepo = new ShopsRepository();
    const shops = await shopsRepo.listStaffShops(
      req.staff.id,
      { name: validQuery.name },
      validQuery.page
    );
    return res.json({
      page: validQuery.page,
      length: shops.length,
      results: shops,
    });
  } catch (error) {
    console.error('Failed to get me: ', error);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
