import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema, updateWorkspaceSchema } from "@/features/workspaces/schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, WORKSPACES_ID, IMAGES_BUCKET_ID, MEMBERS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";
import { getMember } from "@/features/members/utils";

const app = new Hono();

app.get("/", sessionMiddleware, async (c) => {
    try {
        const user = c.get("user");
        const databases = c.get("databases");

        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal('userId', user.$id)]
        );

        if (members.total === 0) {
            return c.json({ data: { documents: [], total: 0 } });
        }

        const workspaceIds = members.documents.map(member => member.workspaceId);

        const workspaces = await databases.listDocuments(
            DATABASE_ID,
            WORKSPACES_ID,
            [
                Query.equal('$id', workspaceIds),
                Query.orderDesc('$createdAt')
            ]
        );

        return c.json({
            data: {
                documents: workspaces.documents,
                total: workspaces.total
            }
        });
    } catch (error) {
        console.error('Error fetching workspaces:', error);
        return c.json({ error: "Failed to fetch workspaces" }, 500);
    }
});

app.post("/", sessionMiddleware, async (c) => {
    try {
        const formData = await c.req.formData();
        const name = formData.get('name') as string;
        const imageFile = formData.get('image') as File | null;

        const databases = c.get("databases");
        const storage = c.get("storage");
        const user = c.get("user");

        if (!user?.$id) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        let imageId: string | undefined;

        if (imageFile) {
            try {
                const file = await storage.createFile(
                    IMAGES_BUCKET_ID,
                    ID.unique(),
                    imageFile
                );
                imageId = file.$id;
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return c.json({ error: "Failed to upload image" }, 500);
            }
        }

        const workspace = await databases.createDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            ID.unique(),
            {
                name,
                userId: user.$id,
                image: imageId,
                inviteCode: generateInviteCode(6),
            }
        );

        await databases.createDocument(
            DATABASE_ID,
            MEMBERS_ID,
            ID.unique(),
            {
                userId: user.$id,
                workspaceId: workspace.$id,
                role: MemberRole.ADMIN,
            }
        );

        return c.json({
            data: {
                ...workspace,
                image: imageId ? `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${IMAGES_BUCKET_ID}/files/${imageId}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}` : undefined
            }
        });
    } catch (error) {
        console.error('Workspace creation error:', error);
        return c.json({ error: "Failed to create workspace" }, 500);
    }
});

app.patch("/:workspaceId", sessionMiddleware, zValidator("form", updateWorkspaceSchema), async (c) => {
    try {
        const databases = c.get("databases");
        const storage = c.get("storage");
        const user = c.get("user");
        const formData = await c.req.formData();
        const imageFile = formData.get('image') as File | null;

        const { workspaceId } = c.req.param();
        const { name, image } = c.req.valid("form");

        const member = await getMember({
            databases,
            workspaceId,
            userId: user.$id,
        });

        if (!member || member.role !== MemberRole.ADMIN) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        let imageId: string | undefined;

        if (imageFile) {
            try {
                const file = await storage.createFile(
                    IMAGES_BUCKET_ID,
                    ID.unique(),
                    imageFile
                );
                imageId = file.$id;
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return c.json({ error: "Failed to upload image" }, 500);
            }
        }

        const workspace = await databases.updateDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            workspaceId,
            {
                name,
                image: imageId
            }
        );

        return c.json({ data: workspace });
    } catch (error) {
        console.error("Workspace update error:", error);
        return c.json({ error: "Failed to update workspace" }, 500);
    }
});

export default app;





