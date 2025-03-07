"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImageIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DottedSeparator } from "@/components/dotted-separator";

import { updateWorkspaceSchema } from "../schemas";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import type { Workspace } from "../types";

interface EditWorkspaceFormProps {
    onCancel?: () => void;
    initialValues: Workspace;
}

export function EditWorkspaceForm({ onCancel, initialValues }: EditWorkspaceFormProps) {
    const router = useRouter();
    const { mutate, isPending } = useUpdateWorkspace();
    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
        resolver: zodResolver(updateWorkspaceSchema),
        defaultValues: {
            name: initialValues.name,
            image: initialValues.image,
        },
    });

    const onSubmit = async (values: z.infer<typeof updateWorkspaceSchema>) => {
        const formData = new FormData();
        formData.append('name', values.name || initialValues.name);
        
        if (values.image instanceof File) {
            formData.append('image', values.image);
        }

        mutate(
            { 
                workspaceId: initialValues.$id,
                name: values.name || initialValues.name,
                image: values.image instanceof File ? values.image : undefined
            },
            {
                onSuccess: () => {
                    form.reset();
                    router.refresh();
                    onCancel?.();
                }
            }
        );
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            form.setValue("image", file);
        }
    };

    // Add image preview cleanup
    useEffect(() => {
        return () => {
            const imageValue = form.getValues("image");
            if (imageValue instanceof File) {
                URL.revokeObjectURL(URL.createObjectURL(imageValue));
            }
        };
    }, [form]);

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex p-7 items-center">
                <CardTitle className="text-xl font-bold">Edit Workspace</CardTitle>
            </CardHeader>
            <div className="px-7">
                <DottedSeparator />
            </div>
            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Workspace Name</FormLabel>
                                    <FormControl>
                                        <input 
                                            {...field}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                            placeholder="Enter workspace name"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField 
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center gap-x-5">
                                        {field.value ? (
                                            <div className="size-[72px] relative rounded-md overflow-hidden">
                                                <Image 
                                                    alt="Logo"
                                                    fill 
                                                    className="object-cover"
                                                    src={field.value instanceof File 
                                                        ? URL.createObjectURL(field.value)
                                                        : `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_IMAGES_BUCKET_ID}/files/${field.value}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`
                                                    } 
                                                />
                                            </div>
                                        ) : (
                                            <Avatar className="size-[72px]">
                                                <AvatarFallback>
                                                    <ImageIcon className="size-[36px] text-neutral-400" />
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className="flex flex-col">
                                            <FormLabel>Workspace Icon</FormLabel>
                                            <p className="text-sm text-muted-foreground">
                                                JPG, PNG, SVG or JPEG, max 1MB
                                            </p>
                                            <input
                                                className="hidden"
                                                type="file"
                                                accept="image/*"
                                                ref={inputRef}
                                                onChange={handleImageChange}
                                                disabled={isPending}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="mt-2 w-fit"
                                                onClick={() => inputRef.current?.click()}
                                                disabled={isPending}
                                            >
                                                Upload Image
                                            </Button>
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                        
                        <div className="flex items-center justify-end gap-x-4">
                            {onCancel && (
                                <Button 
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                    disabled={isPending}
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button 
                                type="submit"
                                disabled={isPending}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};