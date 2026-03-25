"use client";

import { usePathname } from "next/navigation";
import { signOut } from "@/features/auth/services/sign-out";
import { Button } from "@/shared/components/ui/button";

export function SignOutButton() {
  const pathname = usePathname();

  async function handleSignOut() {
    await signOut({ redirectTo: pathname });
  }

  return <Button onClick={handleSignOut}>Sign Out</Button>;
}
