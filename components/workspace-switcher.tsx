"use client";

import { RiAddCircleFill } from "react-icons/ri";
import { useRouter } from "next/navigation"; // Changed from next/router
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { DottedSeparator } from "./dotted-separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { WorkspaceAvatarProps } from "@/features/workspaces/components/workspace-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export const WorkspaceSwitcher = () => {
    const workspaceId = useWorkspaceId();
    const router = useRouter();
    const { data: workspaces } = useGetWorkspaces();

    const onSelect = (id: string) => {
        router.push(`/workspaces/${id}`);
    }

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase text-neutral-500">Workspaces</p>
                <RiAddCircleFill 
                    className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" 
                />
            </div>
            <Select onValueChange={onSelect} value="workspaceId">
                <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
                    <SelectValue placeholder="No workspace selected"/>
                </SelectTrigger>
                <SelectContent>
                    {workspaces?.documents.map((workspace: {
                        imageUrl: string | undefined; 
                        $id: string; 
                        name: string 
                    }) => (
                        <SelectItem key={workspace.$id} value={workspace.$id}>
                            <div className="flex justify-start items-center gap-3 font-medium">
                                <WorkspaceAvatarProps 
                                    name={workspace.name} 
                                    image={workspace.imageUrl}
                                />
                                <span className="truncate">{workspace.name}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <DottedSeparator />
        </div>
    );
};

