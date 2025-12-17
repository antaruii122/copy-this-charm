import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="font-serif text-2xl md:text-3xl mb-4">
            Suscríbete a nuestro contenido
          </h3>
          <p className="text-primary-foreground/80 mb-6">
            Recibe consejos, recursos y novedades sobre bienestar femenino directamente en tu correo.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Tu email"
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
            />
            <Button
              type="submit"
              variant="secondary"
              className="bg-background text-primary hover:bg-background/90 flex-shrink-0"
            >
              Suscribir
            </Button>
          </form>
        </div>
      </div>
      
      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/70">
            <p>© 2024 Ser Integral. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary-foreground transition-colors">Privacidad</a>
              <a href="#" className="hover:text-primary-foreground transition-colors">Términos</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
