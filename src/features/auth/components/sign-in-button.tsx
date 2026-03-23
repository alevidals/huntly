"use client";

import { signIn } from "@/features/auth/services/sign-in";
import { Button } from "@/shared/components/ui/button";

export function SignInButton() {
  async function handleSignIn() {
    await signIn();
  }

  return <Button onClick={handleSignIn}>Sign In with GitHub</Button>;
}
