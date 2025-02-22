import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

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
      // Clear all queries from the cache
      queryClient.clear();
      // Redirect to login page
      router.push('/sign-in');
    },
  });

  return mutation;
};