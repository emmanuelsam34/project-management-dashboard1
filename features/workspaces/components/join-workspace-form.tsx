"use client"

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import Link from "next/link";

interface JoinWorkspaceFormProps {
    initialValues: {
        name: string;
    };
};

export const JoinWorkspaceForm = ({
    initialValues,
}: JoinWorkspaceFormProps) => {
    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="p-7">
                <CardTitle className="text-xl font-bold">
                    Join workspace
                </CardTitle>
                <CardDescription>
                    You've been invited to join <strong>{initialValues.name}</strong> Workspace.
                </CardDescription>
            </CardHeader>
            <div className="px-7">
                <DottedSeparator />
            </div>
            <CardContent className="p-7">
                <div className="flex flex-col lg:flex-row gap-y-2 gap-x-2 items-center justify-between">
                    <Button
                    className="w-full lg:w-fit"
                    variant="secondary"
                    type="button"
                    asChild>
                        <Link href="/">
                        Cancel
                        </Link>
                    </Button>
                    <Button>
                        Join Workspace
                    </Button>

                </div>
            </CardContent>
        </Card>
    );
}