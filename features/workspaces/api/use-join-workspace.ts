import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
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
  inviteCode: string;
};

export const useJoinWorkspace = () => { 
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation<WorkspaceResponse, Error, JoinWorkspaceRequest>({
    mutationFn: async ({ inviteCode }) => {
      try {
        const response = await fetch('/api/workspaces/join', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inviteCode }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || 'Failed to join workspace');
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Join workspace error:', error);
        throw error;
      }
    },

    onSuccess: ({ data }) => {
      toast.success("Successfully joined workspace");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({queryKey: ["workspace", data.$id]})
      router.push(`/workspaces/${data.$id}`);
    },

    onError: (error) => {
      toast.error(error.message || "Failed to join workspace");
    },
  });
};