import { toast } from "sonner";

import { z } from "zod"; 
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(50, "Project name cannot exceed 50 characters"),
  image: z.instanceof(File).optional()
  .optional(),
  workspaceId: z.string().min(1, "Workspace ID is required")

});

type projectResponse = {
  data: {
    $id: string;
    name: string;
    userId: string;
    image?: string;
    workspaceId: string;
  };
};

type projectRequest = z.infer<typeof projectSchema>;

export const useCreateProject = () => { 
  const router = useRouter();
  const queryClient = useQueryClient();
  
  return useMutation<projectResponse, Error, projectRequest>({
    mutationFn: async (form) => {
      try {
        
        const validated = await projectSchema.parseAsync(form);

        
        const formData = new FormData();
        formData.append('name', validated.name);
        formData.append('workspaceId', validated.workspaceId);
        
        
        if (validated.image && validated.image instanceof File) {
          
          if (validated.image.size > 5 * 1024 * 1024) {
            throw new Error('Image size must be less than 300KB');
          }
          
          
          if (!validated.image.type.startsWith('image/')) {
            throw new Error('File must be an image');
          }
          
          formData.append('image', validated.image);
        }

        
        const response = await fetch('/api/projects', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });


        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || 'Failed to create project');
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('project creation error:', error);
        if (error instanceof z.ZodError) {
          throw new Error(error.errors[0].message);
        }
        throw error;
      }
    },

    onSuccess: (data) => {
      toast.success("project created successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push(`/workspaces/${data.data.workspaceId}`);
    },

    onError: (error) => {
      toast.error(error.message || "Failed to create project");
    },
  });
};