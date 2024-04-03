import { Request, Response } from 'express';
import authClient from '@lib/auth';
import { RestoreSessionSetupInput } from '@authservice/server';

type LoginEndInput = Omit<RestoreSessionSetupInput, 'userId'> & {
  id: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validate(body: any): body is LoginEndInput {
  if (typeof body['id'] !== 'number') return false;
  if (typeof body['EACRestoreToken'] !== 'string') return false;
  return true;
}

export async function endLogin(req: Request, res: Response) {
  try {
    if (!validate(req.body)) {
      return res.status(400).json({ error: 'Bad Request' });
    }
    const { id, EACRestoreToken } = req.body;
    const session = await authClient().restoreSetupSession({
      userId: String(id),
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
