import StatCards from "./_components/StatCards";
import QuickActions from "./_components/QuickActions";
import LatestOrders from "./_components/LatestOrders";

export default function Page() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <StatCards />
      <QuickActions />
      <LatestOrders />
    </div>
  );
}