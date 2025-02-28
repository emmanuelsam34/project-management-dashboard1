"use client";

import { useForm} from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import  Link  from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";

import { 
    Card, 
    CardContent,
    CardDescription, 
    CardHeader, 
    CardTitle } from '@/components/ui/card';

import {
        Form,
        FormControl,
        FormField,
        FormItem,
        FormLabel,
        FormMessage,
} from "@/components/ui/form";

import { registerSchema } from "../schemas";
import { useRegister } from '../api/use-register';


export const SignUpCard = () => {
    const { mutate, isPending } = useRegister();

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof registerSchema>) => {
        mutate(values);
    }

    return (
        <Card className="w-full h-full md:w-[487px] border-none shadow-none">
            <CardHeader className="flex items-center justify-center text-center p-7">
                <CardTitle className="text-2xl">
                    Sign Up
                </CardTitle>
                <CardDescription className="text-sm">
                    By signing up, you agree to our { " " }
                    <Link href="/terms">
                    <span className="text-orange-700">Terms of Service</span>
                    </Link> and {""}
                    <Link href="/privacy">
                    <span className="text-blue-700">Policy</span></Link>   
                </CardDescription>
            </CardHeader>
            <div className="px-7">
                <DottedSeparator />
            </div>
            
            <CardContent className="p-7">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                
            <FormField
                name="fullName"
                control={form.control}
                render={({ field }) => (
            <FormItem>
            <FormLabel></FormLabel>
            <FormControl>
                <Input
                    type="text"
                    {...field}
                    placeholder="Enter full name"
                />
            </FormControl>
            <FormMessage />
            </FormItem>
            )} 
            />

            <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
            <FormItem>
            <FormLabel></FormLabel>
            <FormControl>
                <Input
                    type="email"
                    {...field}
                    placeholder="Enter email address"
                />
            </FormControl>
            <FormMessage />
            </FormItem>
            )}
            />

            <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
            <FormItem>
            <FormLabel></FormLabel>
            <FormControl>
                <Input
                    type="password"
                    {...field}
                    placeholder="Enter password"
                />
            </FormControl>
            <FormMessage />
            </FormItem>
            )}
            />
            <Button disabled={isPending} size="lg" className="w-full">
                    Sign Up
            </Button>
            </form>
            </Form>
            </CardContent>
            <div className="px-7">
                <DottedSeparator />
            </div>
            <CardContent className="p-7 flex flex-col gap-y-4">
                <Button 
                 disabled={isPending}
                 variant="secondary"
                 size="lg"
                 className="w-full">
                    <FcGoogle className="mr-2 size-5" />
                    SignUp with Google
                </Button>
                <Button 
                 disabled={isPending}
                 variant="secondary"
                 size="lg"
                 className="w-full">
                    <FaGithub className="mr-2 size-5" />
                    SignUp with Github
                </Button>
            </CardContent>
            <div className="px-7">
                <DottedSeparator />
            </div>
            <CardContent className="p-7 flex items-center justify-center">
                <p>
                    Already have an account? 
                    <Link href="/sign-in">{" "}
                        <span className="text-blue-700">Sign In</span>
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
};