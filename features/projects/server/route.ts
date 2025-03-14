import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { CreateProjectSchema } from "../schema";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";


const projects = new Hono()
    projects.post(
        "/",
        sessionMiddleware,
        zValidator("form", CreateProjectSchema),
        async (c) => {
            try {
                    const formData = await c.req.formData();
                    const name = formData.get('name') as string;
                    const imageFile = formData.get('image') as File | null;
                    const { workspaceId } = c.req.valid("form");
            
                    const databases = c.get("databases");
                    const storage = c.get("storage");
                    const user = c.get("user");
            
                    const member = await getMember({
                        databases,
                        workspaceId,
                        userId: user.$id
                    })

                    if (!user?.$id) {
                        return c.json({ error: "Unauthorized" }, 401);
                    }
            
                    if(!member) {
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
            
                    const project = await databases.createDocument(
                        DATABASE_ID,
                        PROJECTS_ID,
                        ID.unique(),
                        {
                            name,
                            image: imageId,
                            workspaceId
                        }
                    );
            
                    return c.json({
                        data: {
                            ...project,
                            image: imageId ? `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${IMAGES_BUCKET_ID}/files/${imageId}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}` : undefined
                        }
                    });
                } catch (error) {
                    console.error('Project creation error:', error);
                    return c.json({ error: "Failed to create project" }, 500);
                }
        })
    projects.get(
        "/",
        sessionMiddleware,
        zValidator("query", z.object({ workspaceId: z.string()})),

        async (c) => {
            const user = c.get("user");
            const databases = c.get("databases");

            const { workspaceId } = c.req.valid("query");

            if(!workspaceId) {
                return c.json({error: "Missing workspaceId"}, 400)
            }

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            });

            if(!member) {
                return c.json({error: "Unauthorized"}, 401)
            }

            const projects = await databases.listDocuments(
                DATABASE_ID,
                PROJECTS_ID,
                [
                    Query.equal("workspaceId", workspaceId),
                    Query.orderDesc("$createdAt"),
                ]
            );

            return c.json({
                data: projects
            });
        }
    );

export default projects;