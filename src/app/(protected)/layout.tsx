import Navbar from "@/components/Navbar";
import QuickAsk from "@/components/QuickAsk";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
      <QuickAsk />
    </div>
  );
}
