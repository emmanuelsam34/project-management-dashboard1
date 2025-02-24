"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "../api/use-logout";
import { useCurrent } from "../api/use-current";
import { useEffect } from "react";

type User = {
    name: any;
    id: string;
    fullName: string;
    email: string;
};

export const UserButton = () => {
    const { data: user, isLoading, error } = useCurrent();
    const { mutate: logout } = useLogout();

    useEffect(() => {
        console.log("Current user data:", user);
    }, [user]);

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
    const fallbackText = userData.name?.[0]?.toUpperCase() || 
                        userData.email?.[0]?.toUpperCase() || 
                        "U";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none relative">
                <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
                    <AvatarImage src="" alt={userData.name} />
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
                        <AvatarImage src="" alt={userData.name} />
                        <AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-500">
                            {fallbackText}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center gap-1">
                        <p className="font-medium text-sm">
                            {userData.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {userData.email}
                        </p>
                    </div>
                </div>
                <DropdownMenuItem 
                    onClick={() => logout()}
                    className="cursor-pointer"
                >
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};