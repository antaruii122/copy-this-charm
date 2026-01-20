import { ShoppingCart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const DashboardHeader = () => {
  const navItems = [
    { label: "Inicio", href: "/" },
    { label: "Propósito", href: "/#proposito" },
    { label: "Metodología", href: "/#metodologia" },
    { label: "Quien Soy", href: "/#sobre-mi" },
    { label: "Programas", href: "/#programas", hasDropdown: true },
    { label: "Contacto", href: "/#contacto" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-xl md:text-2xl font-semibold text-primary">
              NUTFEM
            </span>
            <span className="text-sage text-xs font-bold">LMS</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-foreground hover:text-primary transition-all text-[11px] font-bold uppercase tracking-[0.1em] flex items-center gap-1"
              >
                {item.label}
                {item.hasDropdown && <ChevronDown size={14} />}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6">
              Aula Virtual
            </Button>
            <Button variant="outline" className="rounded-full px-4 gap-2 border-border">
              <span className="text-foreground/80">$0</span>
              <div className="relative">
                <ShoppingCart size={18} className="text-foreground/60" />
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  0
                </span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
