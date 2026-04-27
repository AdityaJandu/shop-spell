import { OnboardingPage } from "@/modules/onboarding/presentation/ui/OnboardingPage";
import { getSession } from "@/lib/get-session-cached";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { stores } from "@/db/schema";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  // Check if user already has a store
  const store = await db.query.stores.findFirst({
    where: eq(stores.ownerId, session.user.id),
  });

  if (store) {
    redirect(`/${store.id}/analytics`);
  }

  return <OnboardingPage />;
}

