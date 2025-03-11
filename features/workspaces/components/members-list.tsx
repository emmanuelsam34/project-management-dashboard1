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
    name: string;
}

export const MembersList = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const { data } = useGetMembers({ workspaceId });



    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
            <Button size="sm" variant="secondary" onClick={() => router.push(`/workspaces/${workspaceId}`)}>
                    <ArrowLeftIcon className="size-4 mr-2"/>
                    Back
            </Button>
            <CardTitle className="text-xl justify-center gap-x-2 font-bold">
                Members List
            </CardTitle>
            </CardHeader>
            <DottedSeparator />
            <CardContent className="p-7">
                {data?.documents.map((member: Member, index: number) => (
                    <Fragment key={member.$id}>
                        <DottedSeparator />
                        <div className="flex items-center gap-2">
                            <MemberAvatar 
                            className="size-10"
                            fallbackClassName="text-lg"
                            name={member.name}
                            />
                        </div>
                    </Fragment>
                ))}
            </CardContent>
        </Card>

    ) 

}