import { Request, Response } from 'express';
import authClient from '@lib/auth';
import { StaffsRepository } from '@repo/StaffsRepository';

export const initReset = async (req: Request, res: Response) => {
  try {
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
    return res.json({ ...initResponse, id: staff.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unexpected error' });
  }
};
