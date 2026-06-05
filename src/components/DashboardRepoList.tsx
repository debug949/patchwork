"use client";

import { useRouter } from "next/navigation";
import { ConnectRepo } from "./ConnectRepo";

export function DashboardRepoList({
  initialRepos: _initialRepos,
  userId: _userId,
}: {
  initialRepos: unknown[];
  userId: string;
}) {
  const router = useRouter();
  return <ConnectRepo onConnected={() => router.refresh()} />;
}
