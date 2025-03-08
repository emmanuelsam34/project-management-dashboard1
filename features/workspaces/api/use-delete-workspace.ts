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
  };
};

export const useDeleteWorkspace = () => { 
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation<WorkspaceResponse, Error, string>({
    mutationFn: async (workspaceId) => {
      try {
        const response = await fetch(`/api/workspaces/${workspaceId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || 'Failed to delete workspace');
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Workspace deletion error:', error);
        throw error;
      }
    },

    onSuccess: ({ data }) => {
      toast.success("Workspace deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({queryKey: ["workspace", data.$id]})
      router.push('/workspaces');
    },

    onError: (error) => {
      toast.error(error.message || "Failed to delete workspace");
    },
  });
};