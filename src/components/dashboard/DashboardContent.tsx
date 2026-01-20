import DashboardStats from "./DashboardStats";
import ProfileView from "./ProfileView";
import SettingsView from "./SettingsView";
import AgendaView from "./AgendaView";
import RecursosView from "./RecursosView";
import CertificadosView from "./CertificadosView";
import BlogManager from "./BlogManager";
import CourseVideos from "@/components/CourseVideos";
import VideoUploadManager from "@/components/admin/VideoUploadManager";

interface DashboardContentProps {
  activeSection: string;
  courseId?: string;
}

const DashboardContent = ({ activeSection, courseId }: DashboardContentProps) => {
  const renderContent = () => {
    switch (activeSection) {
      case "Escritorio":
        return (
          <>
            <h1 className="text-2xl font-semibold text-foreground mb-8">Escritorio</h1>
            <DashboardStats />
          </>
        );
      case "Mi perfil":
        return <ProfileView />;
      case "Mis Cursos":
        return <CourseVideos courseId={courseId} />;
      case "Agenda":
        return <AgendaView />;
      case "Recursos":
        return <RecursosView />;
      case "Certificados":
        return <CertificadosView />;
      case "Administración de Cursos":
        return <VideoUploadManager />;
      case "Blog":
        return <BlogManager />;
      case "Ajustes":
        return <SettingsView />;
      default:
        return (
          <>
            <h1 className="text-2xl font-semibold text-foreground mb-8">{activeSection}</h1>
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-48 h-32 mb-4 flex items-center justify-center">
                <svg viewBox="0 0 200 150" className="w-full h-full text-muted-foreground/30">
                  <rect x="60" y="40" width="80" height="60" rx="4" fill="currentColor" />
                  <circle cx="85" cy="35" r="8" fill="currentColor" />
                  <path d="M50 110 L70 90 L90 100 L120 70 L150 110 Z" fill="currentColor" opacity="0.5" />
                  <path d="M40 120 C40 120 60 80 80 100 C100 120 120 60 140 80 C160 100 180 70 180 70" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
                </svg>
              </div>
              <p className="text-sage">No hay datos disponibles en esta seccion</p>
            </div>
          </>
        );
    }
  };

  return <main className="flex-1">{renderContent()}</main>;
};

export default DashboardContent;
