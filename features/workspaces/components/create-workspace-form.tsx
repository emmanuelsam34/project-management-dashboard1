"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createWorkspaceSchema } from "../schemas";
import { DottedSeparator } from "@/components/dotted-separator";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

interface CreateWorkspaceFormProps {
    onCancel?: () => void;
};

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
    const form = useForm<z.infer<typeof createWorkspaceSchema>>({
        resolver: zodResolver(createWorkspaceSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
      console.log(values);  
    };

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex p-7">
                <CardTitle>Create a new workspace</CardTitle>
            </CardHeader>
            <div className="px-7">
                <DottedSeparator />
            </div>
            <CardContent className="p-7">

            </CardContent>


        </Card>
    )
};