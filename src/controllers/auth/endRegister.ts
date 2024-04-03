import { Request, Response } from 'express';
import authClient from '@lib/auth';
import { HTTPError } from '@lib/http';
import {
  Failable,
  RegisterSessionSetupInput,
  SessionSetupServerOutput,
} from '@authservice/server';

type RegisterEndInput = Omit<RegisterSessionSetupInput, 'userId'> & {
  id: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validate(body: any): body is RegisterEndInput {
  if (typeof body['id'] !== 'number') return false;
  if (typeof body['EACRegisterToken'] !== 'string') return false;
  return true;
}

export async function endRegister(
  req: Request,
  res: Response<HTTPError | Failable<SessionSetupServerOutput>>
) {
  try {
    if (!validate(req.body)) {
      return res.status(400).json({ error: 'Bad Body' });
    }
    const { id, EACRegisterToken } = req.body;
    const session = await authClient().registerSetupSession({
      userId: String(id),
      EACRegisterToken,
    });
    if (!session.success) {
      return res.status(400).json({ error: 'Session setup failed' });
    }
    return res.json(session);
  } catch (error) {
    console.error('Failed to end register: ', error);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
