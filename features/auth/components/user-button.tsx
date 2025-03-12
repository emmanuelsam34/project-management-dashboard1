"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader, LogOut } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DottedSeparator } from "@/components/dotted-separator";

import { useLogout } from "../api/use-logout";
import { useCurrent } from "../api/use-current";


type User = {
    name: string;
    id: string;
    email: string;
};

export const UserButton = () => {
    const { data: user, isLoading, error } = useCurrent();
    const { mutate: logout } = useLogout();


    if (isLoading) {
        return (
            <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
                <Loader className="size-4 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!user || error) {
        return null;
    }

    const userData = user as unknown as User;
    const fallbackText = userData.name?.[0]?.toUpperCase() ?? 
                        userData.email?.[0]?.toUpperCase() ?? 
                        "U";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none relative">
                <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
                    <AvatarFallback 
                        className="bg-neutral-200 font-medium text-neutral-500"
                        delayMs={1000}
                    >
                        {fallbackText}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom" className="w-60" sideOffset={10}>
                <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
                    <Avatar className="size-[52px] border border-neutral-300">
                        <AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-500">
                            {fallbackText}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center justify-center">
                        <p className="font-medium text-sm text-neutral-900">
                            {userData.name || "User"}
                        </p>
                        <p className="text-xs text-neutral-500">{userData.email}</p>
                    </div>
                </div>
               <DottedSeparator className="mb-1" />
               <DropdownMenuItem 
                onClick={() => logout()}
                className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer">
                    <LogOut className="size-4 mr-1" />
                    Logout 
               </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};