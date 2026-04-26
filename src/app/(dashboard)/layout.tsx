import { TopNav } from "@/modules/dashboard/presentation/components/TopNav";
import { BottomNav } from "@/modules/dashboard/presentation/components/BottomNav";
import { StoreProvider } from "@/modules/dashboard/store-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <TopNav />
      <StoreProvider>
        {children}
      </StoreProvider>
      <BottomNav />
    </div>
  );
}
