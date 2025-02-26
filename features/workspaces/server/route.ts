import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema } from "@/features/workspaces/schemas";
import type { z } from "zod";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, WORKSPACES_ID } from "@/config";
import { ID } from "node-appwrite";
import { Context } from "hono";

interface WorkspaceData {
    name: string;
    userId: string;
    createdAt: string;
}

const app = new Hono();

app.post(
    "/",
    zValidator("json", createWorkspaceSchema),
    sessionMiddleware,
    async (c: Context) => {
        try {
            const databases = c.get("databases");
            const user = c.get("user");

            if (!user?.$id) {
                return c.json({ error: "Unauthorized" }, 401);
            }
            const { name } = await c.req.json<z.infer<typeof createWorkspaceSchema>>();

            const workspace = await databases.createDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                ID.unique(),
                {
                    name,
                    userId: user.$id,
                    createdAt: new Date().toISOString(),
                }
            );

            return c.json({ data: workspace });
        } catch (error) {
            console.error("Error creating workspace:", error);
            return c.json(
                { error: "Failed to create workspace" },
                500
            );
        }
    }
);

export default app;




