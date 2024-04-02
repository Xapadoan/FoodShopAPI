import {
  Failable,
  HTTPError,
  ResetUploadServerInput,
} from '@authservice/server';
import { Request, Response } from 'express';
import authClient from '@lib/auth';

export async function onResetUpload(
  req: Request<ResetUploadServerInput>,
  res: Response<HTTPError | Failable>
) {
  try {
    const result = await authClient().onResetUpload(req.body);
    return res.json(result);
  } catch (error) {
    console.error('Reset upload webhook failed: ', error);
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
