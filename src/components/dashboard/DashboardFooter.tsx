import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

const DashboardFooter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <footer className="mt-auto relative overflow-hidden bg-gradient-to-br from-sage-dark via-primary to-terracotta/80">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-terracotta/10 rounded-full blur-3xl" />

      {/* Newsletter Section */}
      <div className="relative z-10 py-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-primary-foreground text-xs font-medium tracking-wide">
                  ÚNETE A LA COMUNIDAD
                </span>
              </div>

              <h3 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-2">
                Suscríbete a nuestro contenido
              </h3>
              <p className="text-primary-foreground/90 text-lg">
                ¡Entérate de todas nuestras actividades y promociones!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-3">
              <Input
                type="email"
                placeholder="sample@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 backdrop-blur-sm border-white/30 text-primary-foreground placeholder:text-primary-foreground/60 rounded-xl h-14"
              />
              <Button
                type="submit"
                className="bg-white text-primary hover:bg-white/90 rounded-xl px-10 h-14 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="relative z-10 border-t border-primary-foreground/20 bg-sage-dark/30 backdrop-blur-sm py-6 px-4">
        <div className="container mx-auto text-center">
          <p className="text-primary-foreground/80 text-sm font-medium">
            © 2025 Ricardo Rules - Página web creada por{" "}
            <a href="#" className="text-gold hover:text-gold/80 hover:underline transition-colors">
              Agencia Fractal
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
