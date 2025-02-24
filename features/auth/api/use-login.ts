import { useMutation } from "@tanstack/react-query";
import { z } from "zod"; 


const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});


type LoginResponse = {
  token?: string;
  user?: {
    id: string;
    email: string;
  };
};

type LoginRequest = z.infer<typeof loginSchema>;

export const useLogin = () => { 
  const mutation = useMutation<
    LoginResponse,
    Error,
    LoginRequest
  >({
    mutationFn: async (data) => {
      try {
        // Validate the data before sending
        await loginSchema.parseAsync(data);

        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        return response.json();
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error(error.errors[0].message);
        }
        throw new Error(error instanceof Error ? error.message : 'Login failed');
      }
    }
  });

  return mutation;
};