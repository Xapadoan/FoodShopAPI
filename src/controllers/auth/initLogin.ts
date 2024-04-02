import { Request, Response } from 'express';
import authClient from '@lib/auth';
import { Entry } from '@repo/Repository';
import { Staff, StaffRepository } from '@repo/StaffRepository';
import { HTTPError } from '@lib/http';
import {
  RestoreInitServerOutput,
  RestoreInitServiceInput,
} from '@authservice/server';

type InitLoginInput = RestoreInitServiceInput;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validate(body: any): body is InitLoginInput {
  if (typeof body['email'] !== 'string') return false;
  return true;
}

export const initLogin = async (
  req: Request,
  res: Response<
    HTTPError | (RestoreInitServerOutput & { id: Entry<Staff>['id'] })
  >
) => {
  try {
    if (!validate(req.body)) {
      return res.status(400).json({ error: 'Bad Body' });
    }
    const { email } = req.body;
    const staffRepo = new StaffRepository();
    const staff = await staffRepo.read({ email });
    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    const client = authClient();
    const initResponse = await client.initRestore({ email });
    if (!initResponse) {
      return res.status(500).json({ error: 'Failed to init login' });
    }
    return res.json({ id: staff.id, ...initResponse });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unexpected error' });
  }
};
