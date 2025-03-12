import { hc } from "hono/client";
import type { AppType } from '@/types/app';


export const client = hc<AppType>("/api");
export type ClientType = typeof client;
export { hc };
