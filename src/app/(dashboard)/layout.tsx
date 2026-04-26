import { TopNav } from "@/modules/dashboard/presentation/components/TopNav";
import { BottomNav } from "@/modules/dashboard/presentation/components/BottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <TopNav />
      {children}
      <BottomNav />
    </div>
  );
}
