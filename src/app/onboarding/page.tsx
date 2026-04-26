import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session-cached";
import { OnboardingPage } from "@/modules/onboarding/presentation/ui/OnboardingPage";

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return <OnboardingPage />;
}
