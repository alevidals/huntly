import { SignInButton } from "@/features/auth/components/sign-in-button";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { getSession } from "@/features/auth/services/get-session";
import { getDictionary } from "@/shared/lib/i18n/get-dictionary";
import { getRequiredLocale } from "@/shared/lib/i18n/get-required-locale";

type Props = {
  params: Promise<{
    lang: string;
  }>;
};

export default async function Home({ params }: Props) {
  const { lang } = await params;
  const locale = getRequiredLocale({ locale: lang });

  const dictionary = await getDictionary({ locale });
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
          <p>{dictionary.welcome}</p>
          <p>{session.user.name}</p>
          <SignOutButton />
        </>
      )}
    </div>
  );
}
