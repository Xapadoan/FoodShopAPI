import { StaffsRepository } from '@repo/StaffsRepository';
import { Request, Response } from 'express';

export async function readAll(req: Request, res: Response) {
  try {
    if (!req.staff) {
      return res.status(401).json({ error: 'Missing Authentication' });
    }
    const staffRepo = new StaffsRepository();
    const shops = await staffRepo.readAllShops(req.staff.id);
    return res.json(shops);
  } catch (error) {
    console.error('Failed to get me: ', error);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
