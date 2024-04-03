import authClient from '@lib/auth';
import { NextFunction, Request, Response } from 'express';
import { StaffsRepository } from '@repo/StaffsRepository';

export async function staffAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const sessionId = req.headers['authorization']?.split(' ')?.[1];
    if (!sessionId) {
      return res.status(401).json({ error: 'Missing Authentication' });
    }
    const staffId = await authClient().readSession(sessionId);
    if (!staffId) {
      return res.status(401).json({ error: 'Missing Authentication' });
    }
    const staffRepo = new StaffsRepository();
    const staff = await staffRepo.read({ id: Number(staffId) });
    if (!staff) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    req.staff = staff;
    return next();
  } catch (error) {
    console.log('Auth middleware error: ', error);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
