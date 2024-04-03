import { Request, Response } from 'express';

export async function me(req: Request, res: Response) {
  try {
    if (!req.staff) {
      return res.status(401).json({ error: 'Missing Authentication' });
    }
    return res.json(req.staff);
  } catch (error) {
    console.error('Failed to get me: ', error);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
