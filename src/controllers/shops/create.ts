import { Request, Response } from 'express';
import { Entry } from '@repo/Repository';
import { Shop, Staff, ShopsRepository } from '@repo/ShopsRepository';
import { HTTPError } from '@lib/http';

export const create = async (
  req: Request<unknown, unknown, { shop: Shop; staff: Staff }>,
  res: Response<{ shop: Entry<Shop>; staff: Entry<Staff> } | HTTPError>
) => {
  try {
    const repository = new ShopsRepository();
    if (!repository.validate(req.body.shop)) {
      return res.status(400).json({ error: 'Bad shop' });
    }
    if (!repository.validateStaff(req.body.staff)) {
      return res.status(400).json({ error: 'Bad staff' });
    }
    const created = await repository.createWithStaff(req.body);
    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
};
