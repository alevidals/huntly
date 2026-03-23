import { SignInButton } from "@/features/auth/components/sign-in-button";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { getSession } from "@/features/auth/services/get-session";

export default async function Home() {
  const session = await getSession();

  return (
    <div>
      <h1>Hello, World!</h1>
      {!session ? (
        <>
          <p>You are not signed in.</p>
          <SignInButton />
        </>
      ) : (
        <>
          <p>Welcome back, {session.user.name}!</p>
          <SignOutButton />
        </>
      )}
    </div>
  );
}
