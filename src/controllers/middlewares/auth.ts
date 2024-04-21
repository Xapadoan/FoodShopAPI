import authClient from '@lib/auth';
import { NextFunction, Request, Response } from 'express';
import { StaffsRepository } from '@repo/StaffsRepository';

export async function staffAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const [authType, sessionId] = authHeader.split(' ');
    if (authType !== 'Bearer' || !sessionId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const staffId = await authClient().readSession(sessionId);
    if (!staffId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const staffRepo = new StaffsRepository();
    const staff = await staffRepo.read({ id: Number(staffId) });
    if (!staff) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.staff = staff;
    return next();
  } catch (error) {
    console.log('Auth middleware error: ', error);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
