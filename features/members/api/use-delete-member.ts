import { toast } from "sonner";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type WorkspaceResponse = {
  data: {
    $id: string;
    name: string;
    userId: string;
    image?: string;
  };
};

export const useDeleteMember = () => { 
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation<WorkspaceResponse, Error, string>({
    mutationFn: async (memberId) => {
      try {
        const response = await fetch(`/api/members/${memberId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || 'Failed to delete member');
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Member deletion error:', error);
        throw error;
      }
    },

    onSuccess: () => {
      toast.success("Member deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["members"] });
      router.push('/workspaces');
    },

    onError: (error) => {
      toast.error(error.message || "Failed to delete Member");
    },
  });
};