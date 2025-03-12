import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import auth from '@/features/auth/server/route';
import workspaces from '@/features/workspaces/server/route';
import members from '@/features/members/server/route';

// Create the main Hono app with a base path
const app = new Hono().basePath('/api');

// Mount your feature routes
app.route('/auth', auth);
app.route('/workspaces', workspaces);
app.route('/members', members);

// Export only HTTP methods; do not export the app instance itself.
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
