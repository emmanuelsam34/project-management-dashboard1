import { hc } from 'hono/client';

import { AppType } from '@/app/api/[[...route]]/route';

export const clientType = hc<AppType>("process.env.NEXT_PUBLIC_API_URL!") as { client: AppType };

export const client = clientType.client;
export type ClientType = typeof clientType;
export { hc };

