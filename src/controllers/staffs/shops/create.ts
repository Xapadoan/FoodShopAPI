import { Request, Response } from 'express';
import { Entry } from '@repo/Repository';
import { Shop, Staff, ShopsRepository } from '@repo/ShopsRepository';
import { HTTPError } from '@lib/http';

export const create = async (
  req: Request,
  res: Response<{ shop: Entry<Shop>; staff: Entry<Staff> } | HTTPError>
) => {
  try {
    if (!req.staff) {
      return res.status(401).json({ error: 'Missing Authentication' });
    }
    const repository = new ShopsRepository();
    if (!repository.validate(req.body)) {
      return res.status(400).json({ error: 'Bad shop' });
    }
    return res.status(201).json();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
};
