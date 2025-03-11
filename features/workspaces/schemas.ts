import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z.union([
    z.instanceof(File),
    z.string().transform((value) => value === "" ? undefined : value),
  ]).optional(), 
});

export const updateWorkspaceSchema = z.object({
    name: z.string().min(1, "Workspace name is required").max(50),
    image: z.union([z.instanceof(File), z.string()]).optional(),
});

export const joinWorkspaceSchema = z.object({
  code: z.string().min(1, "Invite code is required"),
});




