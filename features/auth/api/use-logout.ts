import { toast } from "sonner";
import { useMutation , useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";


export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Logged out successfully");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"]});
      queryClient.invalidateQueries({ queryKey: ["workspaces"]});
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};