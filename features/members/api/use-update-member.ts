import { toast } from "sonner";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Member = {
  role: 'ADMIN' | 'MEMBER';
};

type WorkspaceResponse = {
  data: {
    $id: string;
    name: string;
    email?: string;
    userId: string;
    role: 'ADMIN' | 'MEMBER';
  };
};

export const useUpdateMember = () => { 
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation<WorkspaceResponse, Error, { memberId: string; data: Member }>({
    mutationFn: async ({ memberId, data }) => {
      try {
        const response = await fetch(`/api/members/${memberId}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || 'Failed to update member');
        }

        const responseData = await response.json();
        return responseData;
      } catch (error) {
        console.error('Member update error:', error);
        throw error;
      }
    },

    onSuccess: (data) => {
      toast.success("Member updated successfully");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },

    onError: (error) => {
      toast.error(error.message || "Failed to update member");
    },
  });
};