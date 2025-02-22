import { z } from 'zod';
import { Env, Hono, MiddlewareHandler } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { loginSchema } from '../schemas';
import { registerSchema } from '../schemas';

import { createAdminClient } from '@/lib/appwrite';
import { ID } from 'node-appwrite';

import { deleteCookie, setCookie } from "hono/cookie";
import { AUTH_COOKIE }  from '../constants';

import { sessionMiddleware } from '@/lib/session-middleware';

const app = new Hono ()

    .get('/current', 
        sessionMiddleware, 
        async (c) => {
        const user = c.get("user");

        return c.json({ data: user});
    })

    .post('/login', 
        zValidator("json", loginSchema),
        async (c) => {
        const { email, password } = c.req.valid("json");
        
        const { account } = await createAdminClient();
        const session = await account.createEmailPasswordSession
        (email, 
        password,
        );

        setCookie(c, AUTH_COOKIE, session.secret, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict', 
            maxAge: 60 * 60 * 24 * 30,
        });


        return c.json({ success: true });
    })

    .post(
        '/register',
        zValidator("json", registerSchema),
        async (c) => {
        const { fullName, email, password } = c.req.valid("json");
        
        const { account } = await createAdminClient();
        await account.create(
            ID.unique(),
            email,
            password,
            fullName
        );

        const session = await account.createEmailPasswordSession
        (email, 
        password,
        );

        setCookie(c, AUTH_COOKIE, session.secret, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict', 
            maxAge: 60 * 60 * 24 * 30,
        });


        return c.json({ success: true });
    })

    .post('/logout', sessionMiddleware, async (c) => {  
        const account = c.get("account");
        
        deleteCookie(c, AUTH_COOKIE);

        await account.deleteSession("current");

        return c.json({ success: true });
    });

export default app;

function post(arg0: string, arg1: MiddlewareHandler<Env, string, { in: { json: { email: string; password: string; fullName: string; }; }; out: { json: { email: string; password: string; fullName: string; }; }; }>, arg2: (c: any) => Promise<any>) {
    throw new Error('Function not implemented.');
}
