"use client";

import React from 'react';
import { useForm} from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react"; // Add this import
import { useState } from "react"; // Add this import

import { 
    Card, 
    CardContent, 
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

import { loginSchema } from "../schemas";
import { useLogin } from "../api/use-login";

export const SignInCard = () => {
    const [showPassword, setShowPassword] = useState(false); // Add this state
    const { mutate, isPending } = useLogin();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },  
    })

    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        mutate(values);
    };

    return (
        <Card className="w-full h-full md:w-[487px] border-none shadow-none">
            <CardHeader className="flex items-center justify-center text-center p-7">
                <CardTitle className="text-2xl">
                    Welcome Back
                </CardTitle>
            </CardHeader>
            <div className="px-7">
                <DottedSeparator />
            </div>
            <CardContent className="p-7">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel></FormLabel>
                            <FormControl>
                                <Input 
                                    type="email"
                                    placeholder="Enter email address"
                                    {...field}
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
                                <div className="relative">
                                    <Input 
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter password"
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}      
                />
                <Button disabled={isPending} size="lg" className="w-full">
                    Login 
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
                    Login with Google
                </Button>
                <Button 
                 disabled={isPending}
                 variant="secondary"
                 size="lg"
                 className="w-full">
                    <FaGithub className="mr-2 size-5" />
                    Login with Github
                </Button>
            </CardContent>
            <div className="px-7">
                <DottedSeparator />
            </div>
            <CardContent className="p-7 flex items-center justify-center">
                <p>
                    Don't have an account? 
                    <Link href="/sign-up">{" "}
                        <span className="text-blue-700">Sign Up</span>
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
};