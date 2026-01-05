import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardFooter from "@/components/dashboard/DashboardFooter";
import UserGreeting from "@/components/dashboard/UserGreeting";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import DashboardContent from "@/components/dashboard/DashboardContent";

const Dashboard = () => {
  const { courseId } = useParams<{ courseId?: string }>();
  const [activeSection, setActiveSection] = useState("Escritorio");

  // If a courseId is provided in URL, show the course content
  useEffect(() => {
    if (courseId) {
      setActiveSection("Mis Cursos");
    }
  }, [courseId]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream via-background to-cream-dark relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose/5 rounded-full blur-3xl" />

      <DashboardHeader />

      <div className="flex-1 container mx-auto px-4 relative z-10">
        <UserGreeting />

        <div className="flex gap-8 py-8">
          <DashboardSidebar activeItem={activeSection} onItemClick={setActiveSection} />
          <MobileSidebar />

          <DashboardContent activeSection={activeSection} courseId={courseId} />
        </div>
      </div>

      <DashboardFooter />
    </div>
  );
};

export default Dashboard;
