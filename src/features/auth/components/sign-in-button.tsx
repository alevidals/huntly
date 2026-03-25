"use client";

import { usePathname } from "next/navigation";
import { signIn } from "@/features/auth/services/sign-in";
import { Button } from "@/shared/components/ui/button";

export function SignInButton() {
  const pathname = usePathname();

  async function handleSignIn() {
    await signIn({ redirectTo: pathname });
  }

  return <Button onClick={handleSignIn}>Sign In with GitHub</Button>;
}
