import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardFooter from "@/components/dashboard/DashboardFooter";
import UserGreeting from "@/components/dashboard/UserGreeting";
import MobileSidebar from "@/components/dashboard/MobileSidebar";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader />
      
      <div className="flex-1 container mx-auto px-4">
        <UserGreeting />
        
        <div className="flex gap-8 py-8">
          <DashboardSidebar />
          <MobileSidebar />
          
          {/* Main Content */}
          <main className="flex-1">
            <h1 className="text-2xl font-semibold text-foreground mb-8">Escritorio</h1>
            <DashboardStats />
          </main>
        </div>
      </div>
      
      <DashboardFooter />
    </div>
  );
};

export default Dashboard;
