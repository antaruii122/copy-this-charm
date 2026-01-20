import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { Menu, X, LayoutDashboard, User, BookOpen, Star, ClipboardList, Bookmark, ShoppingBag, MessageCircleQuestion, Calendar, Settings, LogOut, FileText, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  { label: "Blog", icon: FileText, href: "#blog", adminOnly: true },
  { label: "Reseñas", icon: Star, href: "#resenas" },
  { label: "Mis intentos de cuestionarios", icon: ClipboardList, href: "#cuestionarios" },
  { label: "Lista de deseos", icon: Bookmark, href: "#deseos" },
  { label: "Historial de pedidos", icon: ShoppingBag, href: "#pedidos" },
  { label: "Pregunta y respuesta", icon: MessageCircleQuestion, href: "#preguntas" },
  { label: "Calendar", icon: Calendar, href: "#calendar" },
];

const bottomItems: SidebarItem[] = [
  { label: "Ajustes", icon: Settings, href: "#ajustes" },
  { label: "Salir", icon: LogOut, href: "#salir" },
];

const MobileSidebar = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Escritorio");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return;

      try {
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

    checkAdminStatus();
  }, [user]);

  const filteredMainItems = mainItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-40 bg-primary text-primary-foreground rounded-full shadow-lg w-12 h-12"
      >
        <Menu size={24} />
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-cream via-background to-cream/50 backdrop-blur-xl z-50 transform transition-transform duration-300 shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border/30 bg-white/50 backdrop-blur-sm">
          <span className="font-serif font-bold text-primary text-lg">Menú</span>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-primary/10">
            <X size={20} />
          </Button>
        </div>

        <nav className="py-6 overflow-y-auto max-h-[calc(100vh-60px)]">
          <ul className="space-y-2 px-3">
            {filteredMainItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.label;

              return (
                <li key={item.label}>
                  <button
                    onClick={() => {
                      setActiveItem(item.label);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
                      isActive
                        ? "bg-gradient-to-r from-primary to-sage-dark text-primary-foreground shadow-md"
                        : "text-foreground/70 hover:bg-white/80 hover:text-primary hover:shadow-sm hover:-translate-x-1 backdrop-blur-sm"
                    )}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-sage-dark/20 animate-pulse" />
                    )}
                    <Icon size={20} className="relative z-10" />
                    <span className="relative z-10">{item.label}</span>
                    {isActive && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-rose rounded-l-full" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="my-6 border-t border-border/30 mx-4" />

          <ul className="space-y-2 px-3">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.label;

              return (
                <li key={item.label}>
                  <button
                    onClick={() => {
                      setActiveItem(item.label);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
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
    </div>
  );
};

export default MobileSidebar;
