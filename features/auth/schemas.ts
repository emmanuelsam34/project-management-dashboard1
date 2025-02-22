import { z } from "zod";



export const loginSchema = z.object({
    email: z.string().trim().email(),  
    password: z.string().min(1, "Required"),   
});


export const registerSchema = z.object({
        fullName: z.string().trim().min(1, "Required"),
        email: z.string().trim().email(),
        password: z.string().min(1, "Password is required"),
    });