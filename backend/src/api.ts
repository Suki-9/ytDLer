import { Hono } from 'hono';
import { validator } from 'hono/validator'
import { z } from 'zod';

import { downloader, getProgress } from './scripts/downloader';

export const api = new Hono();

api.post('youtube-dl',
  validator('json', (value, c) => {
    const parsed = z.object({
      id: z.string(),
      url: z.string(),
      options: z.object({
        silent: z.boolean().default(false),
        mimeType: z.enum(["audio/mp3", "audio/wav", "audio/flac", "audio/ogg", "video/mp4", "video/avi"]).default('video/mp4')
      }).default({})
    }).safeParse(value);

    return parsed.success
      ? parsed.data
      : c.json({ err: 'Invalid params!' }, 401);
  }),
  async (c) => {
    const {
      id,
      url,
      options
    } = c.req.valid('json');
    try {
      return c.json({
        ...(await downloader(id, url, id, options.mimeType))
      }, 200);
    } catch (e) {
      console.log(e);
      return c.json({ err: ''}, 500);
    }
  }
);

api.post('progress', 
  validator('json', (val, c) => {
    const parsed = z.object({
      id: z.string(),
    }).safeParse(val);

    return parsed.success
    ? parsed.data
    : c.json({ err: 'Invalid params!' }, 401);
  }),
  async (c) => {
    const { id } = c.req.valid('json');
    const result = getProgress(id);

    return c.json(getProgress(id), ~result.progress ? 200 : 500);
  }
);

