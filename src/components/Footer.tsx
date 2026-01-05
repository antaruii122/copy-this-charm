import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-sage-dark via-primary to-terracotta/80 text-primary-foreground overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-sage-dark/50 to-transparent" />

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-terracotta/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
            <span className="text-gold text-lg">🌿</span>
            <span className="text-primary-foreground text-sm font-medium tracking-wide">
              ÚNETE A NUESTRA COMUNIDAD
            </span>
          </div>

          <h3 className="font-serif text-3xl md:text-4xl mb-4 text-primary-foreground">
            Entérate de nuestras novedades
          </h3>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-xl mx-auto">
            Recibe tips de nutrición, recetas y contenido exclusivo sobre salud hormonal femenina.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-12">
            <Input
              type="email"
              placeholder="Tu email"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-primary-foreground placeholder:text-primary-foreground/60 h-12 rounded-xl focus:border-white/50 focus:ring-2 focus:ring-white/20"
            />
            <Button
              type="submit"
              className="bg-white text-primary hover:bg-white/90 flex-shrink-0 h-12 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Suscribir
            </Button>
          </form>
        </div>
      </div>

      <div className="relative z-10 border-t border-primary-foreground/20 bg-sage-dark/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/80">
            <p className="font-medium">© 2025 Ricardo Rules - Nutrición Femenina. Todos los derechos reservados.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-primary-foreground transition-colors hover:underline">Privacidad</a>
              <a href="#" className="hover:text-primary-foreground transition-colors hover:underline">Términos</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
