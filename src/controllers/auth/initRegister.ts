import { Request, Response } from 'express';
import authClient from '@lib/auth';
import { Staff, StaffsRepository } from '@repo/StaffsRepository';
import { HTTPError } from '@lib/http';
import { RegisterInitServerOutput } from '@authservice/server';
import { Entry } from '@repo/Repository';

export const initRegister = async (
  req: Request,
  res: Response<HTTPError | (RegisterInitServerOutput & Entry<Staff>)>
) => {
  try {
    const staffRepo = new StaffsRepository();
    if (!staffRepo.validate(req.body)) {
      return res.status(400).json({ error: 'Bad Body' });
    }
    const existingUser = await staffRepo.read({ email: req.body.email });
    if (existingUser) {
      return res.status(429).json({ error: 'User already exists' });
    }
    const createdStaff = await staffRepo.create(req.body);
    const client = authClient();
    const initResponse = await client.initRegister({
      email: createdStaff.email,
    });
    if (!initResponse) {
      throw new Error('Failed to init registration');
    }
    return res.status(201).json({ ...createdStaff, ...initResponse });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unexpected error' });
  }
};
