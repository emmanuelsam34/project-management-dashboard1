import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.workspaces ["$post"]>;
type RequestType = InferRequestType<typeof client.api.workspaces ["$post"]>;

export const useCreateWorkspace = () => {
    const queryClient = useQueryClient();


    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api.workspaces["$post"]({ json });

            if (!response.ok) {
                throw new Error("Failed to create workspace");
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        },
    }); 

    return mutation;

};


