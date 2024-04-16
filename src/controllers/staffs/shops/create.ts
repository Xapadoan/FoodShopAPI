import { Request, Response } from 'express';
import { Entry } from '@repo/Repository';
import { Shop, ShopsRepository } from '@repo/ShopsRepository';
import { HTTPError } from '@lib/http';

export const create = async (
  req: Request,
  res: Response<HTTPError | Entry<Shop>>
) => {
  try {
    if (!req.staff) {
      return res.status(401).json({ error: 'Missing Authentication' });
    }
    const repository = new ShopsRepository();
    if (!repository.validate(req.body)) {
      return res.status(400).json({ error: 'Bad shop' });
    }
    const shop = await repository.create(req.body);
    await repository.addStaff(shop.id, req.staff.id);
    return res.status(201).json(shop);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
};
