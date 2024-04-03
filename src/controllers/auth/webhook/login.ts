import {
  HTTPError,
  Failable,
  RestoreUploadServerInput,
} from '@authservice/server';
import { Request, Response } from 'express';
import authClient from '@lib/auth';

export async function onLogin(
  req: Request<RestoreUploadServerInput>,
  res: Response<HTTPError | Failable>
) {
  try {
    const client = authClient();
    const response = await client.onRestoreUpload(req.body);
    return res.json(response);
  } catch (error) {
    console.error('Restore Webhook Failed: ', error);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
