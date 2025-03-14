import Image from "next/image";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar"; 

interface ProjectAvatarProps {
  image?: string;
  name: string;
  className?: string;
};

export const ProjectAvatarProps = ({
    image,
    name,
    className,
}: ProjectAvatarProps) => {   
    if (image) {
        return (
        <div className={cn(
        "size-10 relative rounded-md overflow-hidden",
        className
        )}>
                <Image src={image} alt={name} layout="fill" objectFit="cover" />
            </div>
        )
    }

    return (
        <Avatar className="{cn('size-10 rounded-md', className)}">
            <AvatarFallback className="text-white bg-blue-600 font-semibold text-lg uppercase rounded-md">
                {name[0]}
            </AvatarFallback>
        </Avatar>
    );
    }

