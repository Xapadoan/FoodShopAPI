import { Request, Response } from 'express';
import authClient from '@lib/auth';

export async function endLogin(req: Request, res: Response) {
  try {
    const { id, EACRestoreToken } = req.body;
    const session = await authClient().restoreSetupSession({
      userId: id,
      EACRestoreToken,
    });
    if (!session.success) {
      return res.status(400).json({ error: 'Session setup failed' });
    }
    return res.json(session);
  } catch (error) {
    console.error('Failed to end login: ', error);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
