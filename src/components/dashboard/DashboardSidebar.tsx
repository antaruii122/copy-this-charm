import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  User,
  BookOpen,
  Video,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  label: string;
  icon: React.ElementType;
  href: string;
  adminOnly?: boolean;
}

const mainItems: SidebarItem[] = [
  { label: "Escritorio", icon: LayoutDashboard, href: "#escritorio" },
  { label: "Mi perfil", icon: User, href: "#perfil" },
  { label: "Mis Cursos", icon: BookOpen, href: "#cursos" },
  { label: "Gestión de Videos", icon: Video, href: "#videos", adminOnly: true },
];

const bottomItems: SidebarItem[] = [
  { label: "Ajustes", icon: Settings, href: "#ajustes" },
  { label: "Salir", icon: LogOut, href: "#salir" },
];

interface DashboardSidebarProps {
  activeItem: string;
  onItemClick: (label: string) => void;
}

const DashboardSidebar = ({ activeItem, onItemClick }: DashboardSidebarProps) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const syncAndCheck = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return;

      try {
        const token = await getToken({ template: "supabase" });
        if (token) {
          await supabase.auth.setSession({
            access_token: token,
            refresh_token: "",
          });
        }

        const { data } = await supabase
          .from("admin_emails")
          .select("email")
          .eq("email", user.primaryEmailAddress.emailAddress.toLowerCase().trim())
          .maybeSingle();

        setIsAdmin(!!data);
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    syncAndCheck();
  }, [user, getToken]);

  const filteredMainItems = mainItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <aside className="w-64 min-h-[calc(100vh-200px)] border-r border-border/50 bg-gradient-to-b from-cream via-background to-cream/50 shadow-soft hidden md:block">
      <nav className="py-6">
        {/* Main Navigation */}
        <ul className="space-y-2 px-3">
          {filteredMainItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;

            return (
              <li key={item.label}>
                <button
                  onClick={() => onItemClick(item.label)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden group",
                    isActive
                      ? "bg-gradient-to-r from-primary to-sage-dark text-primary-foreground shadow-md"
                      : "text-foreground/70 hover:bg-white/80 hover:text-primary hover:shadow-sm hover:-translate-x-1 backdrop-blur-sm"
                  )}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-sage-dark/20 animate-pulse" />
                  )}
                  <Icon size={20} className={cn("relative z-10", isActive && "drop-shadow-lg")} />
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-rose rounded-l-full" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Separator */}
        <div className="my-6 border-t border-border/30 mx-4" />

        {/* Bottom Navigation */}
        <ul className="space-y-2 px-3">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;

            return (
              <li key={item.label}>
                <button
                  onClick={() => onItemClick(item.label)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden group",
                    isActive
                      ? "bg-gradient-to-r from-terracotta to-rose-dark text-primary-foreground shadow-md"
                      : "text-foreground/70 hover:bg-white/80 hover:text-terracotta hover:shadow-sm hover:-translate-x-1 backdrop-blur-sm"
                  )}
                >
                  <Icon size={20} className="relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
