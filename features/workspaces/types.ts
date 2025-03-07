import { Models } from "node-appwrite";

export type Workspace = Models.Document & {
    name: string;
    image: string;
    inviteCode: string;
    userId: string;
};

