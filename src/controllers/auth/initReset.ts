import { Request, Response } from 'express';
import authClient from '@lib/auth';
import { StaffsRepository } from '@repo/StaffsRepository';
import { HTTPError } from '@lib/http';
import {
  ResetInitServerOutput,
  ResetInitServiceInput,
} from '@authservice/server';

type InitResetInput = ResetInitServiceInput;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validate(body: any): body is InitResetInput {
  if (typeof body['email'] !== 'string') return false;
  return true;
}

export const initReset = async (
  req: Request,
  res: Response<HTTPError | (ResetInitServerOutput & { id: number })>
) => {
  try {
    if (!validate(req.body)) {
      return res.status(400).json({ error: 'Bad Request' });
    }
    const { email } = req.body;
    const staffRepo = new StaffsRepository();
    const staff = await staffRepo.read({ email });
    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    const initResponse = await authClient().initReset({ email });
    if (!initResponse) {
      return res.status(500).json({ error: 'Failed to init reset' });
    }
    return res.json({ id: staff.id, ...initResponse });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unexpected error' });
  }
};
