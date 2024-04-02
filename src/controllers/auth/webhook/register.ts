import {
  HTTPError,
  Failable,
  RegisterUploadServerInput,
} from '@authservice/server';
import { Request, Response } from 'express';
import authClient from '@lib/auth';

export async function onRegister(
  req: Request<RegisterUploadServerInput>,
  res: Response<HTTPError | Failable>
) {
  try {
    const client = authClient();
    console.log(req.body);
    const response = await client.onRegisterUpload(req.body);
    return res.json(response);
  } catch (error) {
    console.error('Register Webhook Failed: ', error);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
