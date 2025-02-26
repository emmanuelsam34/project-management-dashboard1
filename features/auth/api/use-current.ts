import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { Env, MiddlewareHandler } from "hono";

export const useCurrent = () => {
  return useQuery({
    queryKey: ["current"],
    queryFn: async () => {
      const response = await fetch("/api/auth/current");

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();
      return data;
    },
  });
};

function post(arg0: string, arg1: MiddlewareHandler<Env, string, { in: { json: { name: string; }; }; out: { json: { name: string; }; }; }>, sessionMiddleware: MiddlewareHandler<{ Variables: { account: import("node-appwrite").Account; databases: import("node-appwrite").Databases; storage: import("node-appwrite").Storage; users: import("node-appwrite").Users; user: import("node-appwrite").Models.User<import("node-appwrite").Models.Preferences>; }; }, string, {}>, arg3: (c: any) => Promise<any>) {
    throw new Error("Function not implemented.");
}