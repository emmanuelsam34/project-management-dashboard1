"use client";

import { RiAddCircleFill } from "react-icons/ri";

import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ProjectAvatarProps } from "@/features/projects/components/project-avatar";


interface Project {
    $id: string;
    name: string;
    image?: string;
    workspaceId: string;
    
  }


export const Projects = () => {
    const pathname = usePathname();
    const {open} = useCreateProjectModal();
    const workspaceId = useWorkspaceId();
    const { data } = useGetProjects({
        workspaceId,
    });

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase text-neutral-500">Projects</p>
                <RiAddCircleFill 
                    onClick={open} 
                    className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" 
                />
            </div>
            {data?.documents.map((project: Project) => {
                const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
                const isActive = pathname === href;
                return (
                    <Link 
                        key={project.$id}
                        href={href}>
                        
                        <div 
                        className={cn(
                            'flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500',
                            isActive && 'bg-white shadow-sm hover:opacity-100 text-primary'
                        )}>
                        <ProjectAvatarProps image={project.image} name={project.name}/>
                        <span className="truncate">{project.name}</span>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};