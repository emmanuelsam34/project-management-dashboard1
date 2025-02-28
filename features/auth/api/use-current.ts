import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";


export const useCurrent = () => {
  const query = useQuery({
    
    queryKey: ["current"],
    queryFn: async () => {
      const response = await fetch("/api/auth/current");

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query; 
};
