import { DATABASE_ID, WORKSPACES_ID } from "@/config";
import { getCurrent } from "@/features/auth/queries";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { Workspace } from "@/features/workspaces/types";
import { createSessionClient } from "@/lib/appwrite";
import { redirect } from "next/navigation";


interface WorkspaceIdJoinPageProps {
    params: {
        workspaceId: string;
    };
};

const WorkspaceIdJoinPage = async ({
    params,
}: WorkspaceIdJoinPageProps) => {

    const user = await getCurrent();
    if (!user) redirect("/sign-in");

    const workspace = await getWorkspaceInfo({
        workspaceId: params.workspaceId,
    })

    return (
        <div>
            Workspace Id Join Page
        </div>
    );
};

export default WorkspaceIdJoinPage;