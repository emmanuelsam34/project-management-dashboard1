
import { cookies } from "next/headers"
import { Databases, Client, Query, Account } from "node-appwrite"
import { AUTH_COOKIE } from "@/features/auth/constants"

import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config"
import { WorkspaceSwitcher } from "@/components/workspace-switcher"
import { getMember } from "../members/utils"
import { Workspace } from "./types"
import { createSessionClient } from "@/lib/appwrite"

export const getWorkspaces = async () => {
    try {
        const { databases, account } = await createSessionClient();
        const user = await account.get();
        
        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal('userId', user.$id)]
        );

        if (members.total === 0) {
            return { documents: [], total: 0 };
        }

        
        const workspaceIds = members.documents.map(member => member.workspaceId);

        
        const workspaces = await databases.listDocuments(
            DATABASE_ID,
            WORKSPACES_ID,
            [
                Query.equal('$id', workspaceIds),
                Query.orderDesc('$createdAt')
            ]
        );

        return workspaces;
    
        } catch (error) {
            console.error('Error in getCurrent:', error);
            return { documents: [], total: 0 };   
        }
    }

    interface GetWorkspaceProps {
        workspaceId: string;
    }

    export const getWorkspace = async ({workspaceId}: GetWorkspaceProps) => {
        try {
            const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    
            const session = await (await cookies()).get(AUTH_COOKIE);
    
            if (!session) {
                return null;
            }
    
            client.setSession(session.value);
            const databases = new Databases(client);
            const account = new Account(client);
            const user = await account.get();

            const member = await getMember({
                databases,
                userId: user.$id,
                workspaceId,
            })
            
            if (!member) {
                return null;
            }

            const workspace = await databases.getDocument<Workspace>(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId,
            );
    
            return workspace;
        
            } catch (error) {
                console.error('Error in getCurrent:', error);
                return null;   
            }
        }



