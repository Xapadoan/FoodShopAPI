import { Request, Response } from 'express';
import { HTTPError, ResetConfirmServerOutput } from '@authservice/server';
import authClient from '@lib/auth';

export async function onResetConfirm(
  req: Request,
  res: Response<HTTPError | ResetConfirmServerOutput>
) {
  try {
    const EACResetToken = await authClient().onResetConfirm();
    return res.json({ EACResetToken });
  } catch (error) {
    console.error('Reset confirm webhook failed: ', error);
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
