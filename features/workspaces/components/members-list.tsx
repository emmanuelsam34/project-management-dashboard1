"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { DottedSeparator } from "@/components/dotted-separator";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { Fragment } from "react";
import { MemberAvatar } from "@/features/members/components/members-avatar";
import { Separator } from "@/components/ui/separator";
import { useConfirm } from "@/hooks/use-confirm";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { MemberRole } from "@/features/members/types";

interface Member {
    $id: string;
    name?: string;
    userId: string;
    email?: string;
    workspaceId: string;
    role: 'ADMIN' | 'MEMBER';
}

export const MembersList = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const [ConfirmDialog, confirm] = useConfirm(
        "Remove Member",
        "This member will be removed from the workspace",
        "destructive"
    );
    const { data, isLoading, error } = useGetMembers({ 
        workspaceId: workspaceId || '' 
    });

    const {
        mutate: deleteMember,
        isPending: isDeletingMember
    } = useDeleteMember();

    const {
        mutate: updateMember,
        isPending: isUpdatingMember
    } = useUpdateMember();

    const handleUpdateMember = (memberId: string, role: MemberRole) => {
        updateMember({
            memberId,
            data: {
                role: role
            }
        });
    }

    const handleDeleteMember = async (memberId: string) => {
        const ok = await confirm();
        if(!ok) return;

        deleteMember((memberId),{
            onSuccess: () => {
                window.location.reload();
            },
        });
    };

    if (!workspaceId) {
        return null;
    }

    if (isLoading) {
        return <div>Loading Workspace members</div>;
    }

    if (error) {
        return <div>Error loading Workspace members</div>;
    }

    const members = data?.data.documents || [];

    return (
        <Card className="w-full h-full border-none shadow-none">
            <ConfirmDialog />
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
                    members.map((member: Member, index) => (
                        <Fragment key={member.$id}>
                            <div className="flex items-center justify-between py-4">
                                <div className="flex items-center gap-4">
                                    <MemberAvatar 
                                        className="size-10"
                                        fallbackClassName="text-lg"
                                        name={member.name ?? member.userId}
                                    />
                                    <div className="flex flex-col">
                                        <p className="text-sm font-medium">
                                            {member.name ?? member.userId}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {member.email}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                        >
                                            <MoreVerticalIcon className="size-4 text-muted-foreground"/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="bottom" align="end">
                                        <DropdownMenuItem
                                            className="font-medium"
                                            onClick={() => handleUpdateMember(member.$id, MemberRole.ADMIN)}
                                            disabled={isUpdatingMember}
                                        >
                                            Set as Administrator
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="font-medium"
                                            onClick={() => handleUpdateMember(member.$id, MemberRole.MEMBER)}
                                            disabled={isUpdatingMember}
                                        >
                                            Set as Member
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="font-medium text-amber-700"
                                            onClick={() => handleDeleteMember(member.$id)}
                                            disabled={isDeletingMember}
                                        >
                                            Remove {member.name}
                                        </DropdownMenuItem>

                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            {index < members.length - 1 && (
                                  <Separator />
                            )}
                        </Fragment>
                    ))
                )}
            </CardContent>
        </Card>
    );
};