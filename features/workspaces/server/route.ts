import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema } from "@/features/workspaces/schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, WORKSPACES_ID, IMAGES_BUCKET_ID } from "@/config";
import { ID } from "node-appwrite";

const app = new Hono();

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
            imageFile,
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
      }
    );

    return c.json({ data: workspace });
  } catch (error) {
    console.error('Workspace creation error:', error);
    return c.json({ error: "Failed to create workspace" }, 500);
  }
});

export default app;




