import { Request, Response } from 'express';
import authClient from '@lib/auth';

export async function endReset(req: Request, res: Response) {
  try {
    const { id, EACResetToken } = req.body;
    const session = await authClient().resetSetupSession({
      userId: id,
      EACResetToken,
    });
    if (!session.success) {
      return res.status(400).json({ error: 'Session setup failed' });
    }
    return res.json(session);
  } catch (error) {
    console.error('Failed to end reset: ', error);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
