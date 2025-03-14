import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import { getProject } from "@/features/projects/queries";
import { ProjectAvatarProps } from "@/features/projects/components/project-avatar";


interface ProjectIdPageProps {
    params: { projectId: string };
};
const ProjectIdPage = async ({ 
    params,
 }: ProjectIdPageProps) => {
    const user = await getCurrent();
    if(!user) redirect("/sign-in")

    const initialValues = await getProject({projectId: params.projectId});

    if(!initialValues) {
        throw new Error("Project not found");
    }

    return (
        <div className="flex flex-col gap-y-4"> 
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                <ProjectAvatarProps
                    name={initialValues.name}
                />

            </div>

        </div>
            
        </div>
    );
};

export default ProjectIdPage;