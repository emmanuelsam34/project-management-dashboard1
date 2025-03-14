import {z} from "zod";

export const CreateProjectSchema = z.object({   
    name: z.string().trim().min(1, "Project name is required"),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value),
    ])
    .optional(),
    workspaceId: z.string().min(1, "Workspace ID is required")
});
    