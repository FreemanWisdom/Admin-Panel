"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const frame = requestAnimationFrame(() => {
      if (!token) {
        router.replace("/login");
        setIsChecking(false);
        return;
      }

      setIsAuthorized(true);
      setIsChecking(false);
    });

    return () => cancelAnimationFrame(frame);
  }, [router]);

  if (isChecking) {
    return (
      <div className="p-6">
        <Skeleton className="h-[80vh] w-full" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
