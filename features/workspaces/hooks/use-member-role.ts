import { useQuery } from "@tanstack/react-query";

export enum MemberRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER"
}

export const useMemberRole = (workspaceId: string) => {
  const { data: role } = useQuery({
    queryKey: ["member-role", workspaceId],
    queryFn: async () => {
      const response = await fetch(`/api/workspaces/${workspaceId}/role`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch member role");
      }

      const data = await response.json();
      return data.role as MemberRole;
    },
  });

  return role;
};