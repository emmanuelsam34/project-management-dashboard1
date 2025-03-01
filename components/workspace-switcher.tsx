"use client";

import { RiAddCircleFill } from "react-icons/ri";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { DottedSeparator } from "./dotted-separator";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from "react";

export const WorkspaceSwitcher = () => {
    const { data: workspaces } = useGetWorkspaces();

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase text-neutral-500">Workspaces</p>
                <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />

            </div>
            <Select>
                <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
                    <SelectValue placeholder="No workspace selected"/>
                    <SelectContent>
                        {workspaces?.documents.map((workspace: { $id: string; name: string })  => (
                            <SelectItem key={workspace.$id} value={workspace.$id}>
                                {workspace.name}
                            </SelectItem>)
                        )}
                    </SelectContent>

                </SelectTrigger>
            </Select>
            <DottedSeparator />

        </div>
    );
};

