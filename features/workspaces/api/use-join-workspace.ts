import { toast } from "sonner";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type WorkspaceResponse = {
  data: {
    $id: string;
    name: string;
    userId: string;
    image?: string;
    inviteCode: string;
  };
};

type JoinWorkspaceRequest = {
  workspaceId: string;
  code: string; // Changed from inviteCode to code
};

export const useJoinWorkspace = () => { 
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation<WorkspaceResponse, Error, JoinWorkspaceRequest>({
    mutationFn: async ({ workspaceId, code }) => { // Changed parameter name
      try {
        if (!workspaceId || !code) {
          throw new Error('Workspace ID and invite code are required');
        }

        const response = await fetch(`/api/workspaces/${workspaceId}/join`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code // Changed to match schema
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 
            `Failed to join workspace: ${response.statusText}`
          );
        }

        const data = await response.json();
        if (!data || !data.data) {
          throw new Error('Invalid response from server');
        }

        return data;
      } catch (error) {
        console.error('Join workspace error:', error);
        throw new Error(
          error instanceof Error ? error.message : 'Failed to join workspace'
        );
      }
    },

    onSuccess: ({ data }) => {
      toast.success("Successfully joined workspace");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
      router.push(`/workspaces/${data.$id}`);
    },

    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to join workspace"
      );
    },
  });
};