import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/actions";
import { getWorkspaces } from "@/features/workspaces/actions";


export default async function Home() {
  const user = await getCurrent();

  if (!user) {
    redirect("/sign-in");
  }

  const workspaces = await getWorkspaces();

    return (
       <div>
        Home Page
       </div>
    );
}