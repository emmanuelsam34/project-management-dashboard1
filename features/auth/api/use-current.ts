import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useCurrent = () => {
    const query = useQuery({
        queryKey: ["current"],
        queryFn: async () => {
            try {
                const response = await client.get('/current');
                return response;
            } catch (error) {
                console.error('Error fetching current user:', error);
                return null;
            }
        },
    });

    return query;
};