"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { DottedSeparator } from "@/components/dotted-separator";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { Fragment } from "react";
import { MemberAvatar } from "@/features/members/components/members-avatar";

interface Member {
    $id: string;
    name?: string;
    userId: string;
    workspaceId: string;
    role: 'ADMIN' | 'MEMBER';
}

export const MembersList = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const { data, isLoading, error } = useGetMembers({ 
        workspaceId: workspaceId || '' 
    });

    if (!workspaceId) {
        return null;
    }

    if (isLoading) {
        return <div>Loading members...</div>;
    }

    if (error) {
        return <div>Error loading members</div>;
    }

    const members = data?.data.documents || [];

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
                <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={() => router.push(`/workspaces/${workspaceId}`)}
                >
                    <ArrowLeftIcon className="size-4 mr-2"/>
                    Back
                </Button>
                <CardTitle className="text-xl justify-center gap-x-2 font-bold">
                    Members List
                </CardTitle>
            </CardHeader>
            <DottedSeparator />
            <CardContent className="p-7">
                {members.length === 0 ? (
                    <div className="text-center text-muted-foreground">
                        No members found
                    </div>
                ) : (
                    members.map((member: Member) => (
                        <Fragment key={member.$id}>
                            <div className="flex items-center justify-between py-4">
                                <div className="flex items-center gap-4">
                                    <MemberAvatar 
                                        className="size-10"
                                        fallbackClassName="text-lg"
                                        name={member.name || member.userId}
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            {member.name || member.userId}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {member.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <DottedSeparator />
                        </Fragment>
                    ))
                )}
            </CardContent>
        </Card>
    );
};