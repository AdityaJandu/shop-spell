import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session-cached";
import { TopNav } from "@/modules/dashboard/presentation/components/TopNav";
import { BottomNav } from "@/modules/dashboard/presentation/components/BottomNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <TopNav />
      {children}
      <BottomNav />
    </div>
  );
}
