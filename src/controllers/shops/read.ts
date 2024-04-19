import { HTTPError } from '@lib/http';
import { Shop } from '@repo/ShopsRepository';
import { Entry } from '@repo/Repository';
import { Request, Response } from 'express';

export async function read(
  req: Request<{ shopId: number }>,
  res: Response<HTTPError | Entry<Shop>>
) {
  try {
    if (!req.shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    return res.json(req.shop);
  } catch (error) {
    console.error('Failed to read shop: ', error);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
