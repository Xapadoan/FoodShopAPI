import { Request, Response } from 'express';
import authClient from '@lib/auth';

export async function logout(req: Request, res: Response) {
  try {
    const sessionId = req.headers['authorization']?.split(' ')?.[1];
    if (sessionId) {
      await authClient().deleteSession(sessionId);
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to logout: ', error);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
