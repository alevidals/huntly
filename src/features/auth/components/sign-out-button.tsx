"use client";

import { signOut } from "@/features/auth/services/sign-out";
import { Button } from "@/shared/components/ui/button";

export function SignOutButton() {
  async function handleSignOut() {
    await signOut();
  }

  return <Button onClick={handleSignOut}>Sign Out</Button>;
}
