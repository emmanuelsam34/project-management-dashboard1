import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";


interface ProjectIdPageProps {
    params: { projectId: string };
};
const ProjectIdPage = async ({ 
    params,
 }: ProjectIdPageProps) => {
    const user = await getCurrent();
    if(!user) redirect("/sign-in")

    return (
        <div className="w-full lg:max-w-xl"> 
            Project Id: {params.projectId} 
        </div>
    );
};

export default ProjectIdPage;