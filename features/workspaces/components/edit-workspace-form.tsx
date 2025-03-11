"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import Image from "next/image";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DottedSeparator } from "@/components/dotted-separator";

import { updateWorkspaceSchema } from "../schemas";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import type { Workspace } from "../types";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { useGetWorkspaces } from "../api/use-get-workspaces";
import { Input } from "@/components/ui/input";
import { useResetInviteCode } from "../api/use-reset-invite-code";

interface EditWorkspaceFormProps {
    onCancel?: () => void;
    initialValues: Workspace;
}

export function EditWorkspaceForm({ onCancel, initialValues }: Readonly<EditWorkspaceFormProps>) {
    const router = useRouter();
    const { mutate, isPending } = useUpdateWorkspace();
    const { 
        mutate: deleteWorkspace, 
        isPending: isDeletingWorkspace 
    } = useDeleteWorkspace();
    const { data: workspaces } = useGetWorkspaces();
    const {
        mutate: resetInviteCode, 
        isPending: isResettingInviteCode
    } = useResetInviteCode();

    const [DeleteDialog, confirmDelete] = useConfirm(
        "Delete Workspace",
        "This action cannot be undone.",
        "destructive",
    );

    const [ResetDialog, confirmReset] = useConfirm(
        "Reset invite link",
        "This will invalidate the current invite link",
        "destructive",
    );

    const handleDelete = async () => {
        const ok = await confirmDelete();

        if (!ok) return;

        deleteWorkspace(initialValues.$id, {
            onSuccess: () => {
                const remainingWorkspaces = workspaces?.documents.filter(
                    (workspace: { $id: string; }) => workspace.$id !== initialValues.$id
                );

                
                setTimeout(() => {
                    if (remainingWorkspaces?.length) {
                        router.push(`/workspaces/${remainingWorkspaces[0].$id}`);
                    } else {
                        
                        window.location.href = '/workspaces/create';
                    }
                    toast.success("Workspace deleted successfully");
                }, 0);
            },
            onError: (error) => {
                toast.error(error.message || "Failed to delete workspace");
            }
        });
    };

    const handleResetInviteCode = async () => {
        const ok = await confirmReset();

        if (!ok) return;
        
        resetInviteCode(initialValues.$id, {
                onSuccess: () => {
                  router.refresh();  
                }
        });
    };

    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
        resolver: zodResolver(updateWorkspaceSchema),
        defaultValues: {
            name: initialValues.name,
            image: initialValues.image,
        },
    });

    const getImageUrl = (image: string) => {
        if (!image) return '';
        
        return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${encodeURIComponent(process.env.NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID ?? '')}/files/${encodeURIComponent(image)}/view?project=${encodeURIComponent(process.env.NEXT_PUBLIC_APPWRITE_PROJECT ?? '')}`;
    };


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
                onSuccess: (data) => {
                    form.reset();
                    router.push(`/workspaces/${data.data.$id}`);
                    toast.success("Workspace updated successfully");
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

    
    useEffect(() => {
        return () => {
            const imageValue = form.getValues("image");
            if (imageValue instanceof File) {
                URL.revokeObjectURL(URL.createObjectURL(imageValue));
            }
        };
    }, [form]);

    const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`

    const handleCopyInviteLink = () => {
        navigator.clipboard.writeText(fullInviteLink)
        .then(() => toast.success("Invite link copied to clipboard"))
    }

    return (
        <div className="flex flex-col gap-y-4">
            <DeleteDialog />
            <ResetDialog />
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
                <Button size="sm" variant="secondary" onClick={onCancel || (() => router.push(`/workspaces/${initialValues.$id}`))}>
                    <ArrowLeftIcon className="size-4 mr-2"/>
                    Back
                </Button>
                <CardTitle className="text-xl items-center font-bold">{initialValues.name}</CardTitle>
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
                                                    alt="logo"
                                                    fill 
                                                    className="object-cover"
                                                    src={field.value instanceof File 
                                                        ? URL.createObjectURL(field.value)
                                                        : field.value 
                                                            ? `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${encodeURIComponent(process.env.NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID ?? '')}/files/${encodeURIComponent(field.value)}/view?project=${encodeURIComponent(process.env.NEXT_PUBLIC_APPWRITE_PROJECT ?? '')}`
                                                            : ''}
                                                    onError={(e) => {
                                                        console.error('Image load error:', e);
                                                        form.setValue('image', undefined);
                                                    }}
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
                                                JPG, PNG, SVG or JPEG, max 300KB
                                            </p>
                                            <input
                                                className="hidden"
                                                type="file"
                                                accept="image/*"
                                                ref={inputRef}
                                                onChange={handleImageChange}
                                                disabled={isPending}
                                            />
                                        {field.value ? (
                                        <Button
                                        type="button"
                                        disabled={isPending}
                                        variant="destructive"
                                        size="xs"
                                        className="w-fit mt-2"
                                        onClick={() => {
                                            field.onChange(null);
                                            if (inputRef.current){
                                                inputRef.current.value = ""
                                            }
                                        }}
                                        >
                                            Remove Image
                                        </Button>
                                        ) : (
                                            <Button
                                            type="button"
                                            disabled={isPending}
                                            variant="teritary"
                                            size="xs"
                                            className="w-fit mt-2"
                                            onClick={() => inputRef.current?.click()}
                                            >
                                                Upload Image
                                            </Button>
                                        )
                                        }
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
        <div className="flex flex-col gap-y-4">
            <Card className="w-full h-full border-none shadow-none">
            </Card>
            <Card className="w-full h-full border-none shadow-none">
                <CardContent className="p-7">
                    <div className="flex flex-col">
                        <h3 className="font-bold">Invite Members</h3>
                        <p className="text-sm text-muted-foreground">
                            Use the invite link to add members to your workspace.
                        </p>
                        <div className="mt-4">
                            <div className="flex items-center gap-x-2">
                                <Input disabled value={fullInviteLink} />
                                <Button
                                onClick={handleCopyInviteLink}
                                variant="secondary"
                                className="size-12"
                                >
                                  <CopyIcon className="size-5"/>  
                                </Button> 


                            </div>
                        </div>
                        <DottedSeparator className="py-7" />
                        <Button 
                        className="mt-6 w-fit ml-auto"
                        size="sm"
                        variant="destructive"
                        type="button"
                        disabled={isPending || isResettingInviteCode}
                        onClick={handleResetInviteCode}>
                            Reset Invite Link
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Card className="w-full h-full border-none shadow-none">
                <CardContent className="p-7">
                    <div className="flex flex-col">
                        <h3 className="font-bold">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground">
                            Deleting a workspace is irreversible and will remove all associated data
                        </p>
                        <DottedSeparator className="py-7" />
                        <Button 
                        className="mt-6 w-fit ml-auto"
                        size="sm"
                        variant="red"
                        type="button"
                        disabled={isPending || isDeletingWorkspace}
                        onClick={handleDelete}>
                            Delete Workspace
                        </Button>
                    </div>
                </CardContent>
            </Card>

        </div>
        </div>
    );


};