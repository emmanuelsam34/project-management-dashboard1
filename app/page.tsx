"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrent } from "../features/auth/api/use-current";
import { useLogout } from "../features/auth/api/use-logout";
import { UserButton } from "@/features/auth/components/user-button";

export default function Home() {
  const router = useRouter();
  const { data, isLoading } = useCurrent();
  const { mutate: logout } = useLogout();

  useEffect(() => {
    if (!data && !isLoading) {
      router.push("/sign-in");
    }
  }, [data, isLoading, router]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <UserButton />
    </div>
  );
}