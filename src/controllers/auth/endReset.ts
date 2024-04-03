import { Request, Response } from 'express';
import authClient from '@lib/auth';
import { HTTPError } from '@lib/http';
import {
  Failable,
  ResetSessionSetupInput,
  SessionSetupServerOutput,
} from '@authservice/server';

type ResetEndInput = Omit<ResetSessionSetupInput, 'userId'> & {
  id: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validate(body: any): body is ResetEndInput {
  if (typeof body['id'] !== 'number') return false;
  if (typeof body['EACResetToken'] !== 'string') return false;
  return true;
}

export async function endReset(
  req: Request,
  res: Response<HTTPError | Failable<SessionSetupServerOutput>>
) {
  try {
    if (!validate(req.body)) {
      return res.status(400).json({ error: 'Bad Request' });
    }
    const { id, EACResetToken } = req.body;
    const session = await authClient().resetSetupSession({
      userId: String(id),
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
