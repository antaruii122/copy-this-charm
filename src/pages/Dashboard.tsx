import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardFooter from "@/components/dashboard/DashboardFooter";
import UserGreeting from "@/components/dashboard/UserGreeting";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import DashboardContent from "@/components/dashboard/DashboardContent";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("Escritorio");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader />
      
      <div className="flex-1 container mx-auto px-4">
        <UserGreeting />
        
        <div className="flex gap-8 py-8">
          <DashboardSidebar activeItem={activeSection} onItemClick={setActiveSection} />
          <MobileSidebar />
          
          <DashboardContent activeSection={activeSection} />
        </div>
      </div>
      
      <DashboardFooter />
    </div>
  );
};

export default Dashboard;
