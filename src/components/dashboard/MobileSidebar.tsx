import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { Menu, X, LayoutDashboard, User, BookOpen, Star, ClipboardList, Bookmark, ShoppingBag, MessageCircleQuestion, Calendar, Settings, LogOut, FileText } from "lucide-react";
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
          .eq("email", user.primaryEmailAddress.emailAddress)
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
          "fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-semibold text-foreground">Menú</span>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </Button>
        </div>

        <nav className="py-4 overflow-y-auto max-h-[calc(100vh-60px)]">
          <ul className="space-y-1 px-3">
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
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="my-4 border-t border-border mx-3" />

          <ul className="space-y-1 px-3">
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
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
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
