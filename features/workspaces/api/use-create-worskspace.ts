import { toast } from "sonner";

import { useMutation } from "@tanstack/react-query";
import { z } from "zod"; 
import { useQueryClient } from "@tanstack/react-query";

const workspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required").max(50, "Workspace name cannot exceed 50 characters"),
  description: z.string().optional()
});

type WorkspaceResponse = {
  data: {
    $id: string;
    name: string;
    userId: string;
    createdAt: string;
  };
};

type WorkspaceRequest = z.infer<typeof workspaceSchema>;

export const useCreateWorkspace = () => { 
  const queryClient = useQueryClient();
  const mutation = useMutation<
    WorkspaceResponse,
    Error,
    WorkspaceRequest
  >({
    mutationFn: async (data) => {
      try {
        await workspaceSchema.parseAsync(data);

        const response = await fetch('/api/workspaces', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to create workspace');
        }

        return response.json();
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error(error.errors[0].message);
        }
        throw new Error(error instanceof Error ? error.message : 'Failed to create workspace');
      }
    },

    onSuccess: () => {
        toast.success("Workspace created successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: (error) => {
      toast.error("Failed to create workspace: " + error.message);
    },
  });

  return mutation;
};