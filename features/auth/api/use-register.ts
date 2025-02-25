import { useMutation } from "@tanstack/react-query";
import { z } from "zod"; 
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";


const registerSchema = z.object({
  fullName: z.string().trim().min(1, "Required"),
  email: z.string().trim().email(),
  password: z.string().min(1, "Password is required"),
});


type LoginResponse = {
  token?: string;
  user?: {
    id: string;
    email: string;
  };
};

type LoginRequest = z.infer<typeof registerSchema>;

export const useRegister = () => { 
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<
    LoginResponse,
    Error,
    LoginRequest
  >({
    mutationFn: async (data) => {
      try {
        
        await registerSchema.parseAsync(data);

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Registration failed');
        }

        return response.json();
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error(error.errors[0].message);
        }
        throw new Error(error instanceof Error ? error.message : 'Registration failed');
      }
    },
    onSuccess: () => {
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    }
  });

  return mutation;
};