import { z } from 'zod';
import { Env, Hono, MiddlewareHandler } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { loginSchema } from '../schemas';
import { registerSchema } from '../schemas';

const app = new Hono ()
    .post('/login', 
        zValidator("json", loginSchema),
        async (c) => {
        const { email, password } = c.req.valid("json");
        
        console.log({ email, password });
        return c.json({ email, password });
    })
    
    .post(
        '/register',
        zValidator("json", registerSchema),
        async (c) => {
        const { fullName, email, password } = c.req.valid("json");
        
        console.log({ fullName, email, password });
        return c.json({ fullName, email, password });
    }
);

export default app;

function post(arg0: string, arg1: MiddlewareHandler<Env, string, { in: { json: { email: string; password: string; fullName: string; }; }; out: { json: { email: string; password: string; fullName: string; }; }; }>, arg2: (c: any) => Promise<any>) {
    throw new Error('Function not implemented.');
}
