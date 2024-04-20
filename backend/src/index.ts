import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { api } from './api';

const app = new Hono();

app.use('/*', serveStatic({ root: './Public' }))
app.use('/api/*', cors());
app.route('/api', api);

const port = 7750;
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
