import { useQuery } from "@tanstack/react-query";

interface Member {
  $id: string;
  name?: string;
  userId: string;
  workspaceId: string;
  role: 'ADMIN' | 'MEMBER';
}

interface MembersResponse {
  data: {
    documents: Member[];
    total: number;
  }
}

interface useGetMembersProps {
  workspaceId: string;
}

export const useGetMembers = ({ workspaceId }: useGetMembersProps) => {
  return useQuery<MembersResponse, Error>({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await fetch(`/api/members?workspaceId=${encodeURIComponent(workspaceId)}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Failed to fetch members: ${response.statusText}`);
      }

      return response.json();
    },
    enabled: Boolean(workspaceId),
  });
};
