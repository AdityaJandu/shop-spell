import { SignupPage } from "@/modules/auth/presentation/ui/SignupPage";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session-cached";

export default async function Page() {
  const session = await getSession();

  if (session?.user) {
    redirect("/onboarding");
  }
  return <SignupPage />;
}
