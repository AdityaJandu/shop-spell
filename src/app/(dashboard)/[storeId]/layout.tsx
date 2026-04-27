import { TopNav } from "@/modules/dashboard/presentation/components/TopNav";
import { BottomNav } from "@/modules/dashboard/presentation/components/BottomNav";
import { StoreProvider } from "@/modules/dashboard/store-context";
import { getSession } from "@/lib/get-session-cached";
import { redirect } from "next/navigation";

export default async function DashboardLayout(props: {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }

  const params = await props.params;
  const { storeId } = params;

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <StoreProvider storeId={storeId}>
        <TopNav />
        {props.children}
        <BottomNav />
      </StoreProvider>
    </div>
  );
}
