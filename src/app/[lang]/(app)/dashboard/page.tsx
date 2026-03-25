import { ApplicationsTable } from "@/features/applications/components/applications-table";
import { InsertApplicationButton } from "@/features/applications/components/insert-application-button";
import { getApplications } from "@/features/applications/services/get-applications";
import { requireAuth } from "@/shared/lib/auth/require-auth";
import { getDictionary } from "@/shared/lib/i18n/get-dictionary";
import { getRequiredLocale } from "@/shared/lib/i18n/get-required-locale";

type Props = {
  params: Promise<{
    lang: string;
  }>;
};

export default async function Dashboard({ params }: Props) {
  const { lang } = await params;
  const locale = getRequiredLocale({ locale: lang });
  const dict = await getDictionary({ locale });

  const session = await requireAuth({ locale });

  const applications = await getApplications({
    userId: session.user.id,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <InsertApplicationButton dict={dict} />
      <ApplicationsTable applications={applications} dict={dict} />
    </div>
  );
}
