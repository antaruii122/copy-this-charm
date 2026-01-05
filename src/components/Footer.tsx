import { Instagram, Facebook, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-primary via-rose-dark to-primary/90 text-white overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Newsletter Section */}
        <div className="max-w-xl mx-auto text-center mb-12">
          <h3 className="font-serif text-3xl md:text-4xl mb-3">
            Entérate de Nuestras Novedades
          </h3>
          <p className="text-white/90 mb-6">
            Recibe tips de nutrición y contenido exclusivo sobre salud hormonal femenina
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Tu email"
              className="bg-white/20 backdrop-blur-sm border-white/40 text-white placeholder:text-white/70 h-12 rounded-xl focus:border-white focus:ring-2 focus:ring-white/30"
            />
            <Button
              type="submit"
              className="bg-white text-primary hover:bg-white/90 h-12 px-8 rounded-xl font-semibold"
            >
              Suscribir
            </Button>
          </form>
        </div>

        {/* Footer Info */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
            {/* Copyright */}
            <p className="text-white/80">
              © 2025 <span className="font-semibold">Alimenta tu Fertilidad</span> - Todos los derechos reservados
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/alimentatufertilidad"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/alimentatufertilidad"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="mailto:contacto@alimentatufertilidad.com"
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>

            {/* Links */}
            <div className="flex gap-6 text-white/80">
              <a href="#" className="hover:text-white transition-colors hover:underline">
                Privacidad
              </a>
              <a href="#" className="hover:text-white transition-colors hover:underline">
                Términos
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
