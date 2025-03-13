import { useQuery } from "@tanstack/react-query";


interface useGetProjectsProps {
    workspaceId: string;
};

export const useGetProjects = ({
    workspaceId,
}: useGetProjectsProps) => {
 const query = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const url = new URL("/api/projects", window.location.origin);
      url.searchParams.set('workspaceId', workspaceId);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};