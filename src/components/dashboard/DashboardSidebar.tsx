import { useState } from "react";
import {
  LayoutDashboard,
  User,
  BookOpen,
  Star,
  ClipboardList,
  Bookmark,
  ShoppingBag,
  MessageCircleQuestion,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

const mainItems: SidebarItem[] = [
  { label: "Escritorio", icon: LayoutDashboard, href: "#escritorio" },
  { label: "Mi perfil", icon: User, href: "#perfil" },
  { label: "Cursos inscritos", icon: BookOpen, href: "#cursos" },
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

const DashboardSidebar = () => {
  const [activeItem, setActiveItem] = useState("Escritorio");

  return (
    <aside className="w-64 min-h-[calc(100vh-200px)] border-r border-border bg-white hidden md:block">
      <nav className="py-4">
        {/* Main Navigation */}
        <ul className="space-y-1 px-3">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;
            
            return (
              <li key={item.label}>
                <button
                  onClick={() => setActiveItem(item.label)}
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

        {/* Separator */}
        <div className="my-4 border-t border-border mx-3" />

        {/* Bottom Navigation */}
        <ul className="space-y-1 px-3">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;
            
            return (
              <li key={item.label}>
                <button
                  onClick={() => setActiveItem(item.label)}
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
  );
};

export default DashboardSidebar;
