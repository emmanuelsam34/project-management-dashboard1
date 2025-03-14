import { toast } from "sonner";

import { z } from "zod"; 
import { useQueryClient, useMutation } from "@tanstack/react-query";

const workspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required").max(50, "Workspace name cannot exceed 50 characters"),
  image: z.instanceof(File).optional()
});

type WorkspaceResponse = {
  data: {
    $id: string;
    name: string;
    userId: string;
    image?: string;
  };
};

type WorkspaceRequest = z.infer<typeof workspaceSchema>;

export const useCreateWorkspace = () => { 
  const queryClient = useQueryClient();
  
  return useMutation<WorkspaceResponse, Error, WorkspaceRequest>({
    mutationFn: async (form) => {
      try {
        
        const validated = await workspaceSchema.parseAsync(form);

        
        const formData = new FormData();
        formData.append('name', validated.name);
        
        
        if (validated.image && validated.image instanceof File) {
          
          if (validated.image.size > 5 * 1024 * 1024) {
            throw new Error('Image size must be less than 5MB');
          }
          
          
          if (!validated.image.type.startsWith('image/')) {
            throw new Error('File must be an image');
          }
          
          formData.append('image', validated.image);
        }

        
        const response = await fetch('/api/workspaces', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || 'Failed to create workspace');
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Workspace creation error:', error);
        if (error instanceof z.ZodError) {
          throw new Error(error.errors[0].message);
        }
        throw error;
      }
    },

    onSuccess: (data) => {
      toast.success("Workspace created successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },

    onError: (error) => {
      toast.error(error.message || "Failed to create workspace");
    },
  });
};