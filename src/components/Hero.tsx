import heroBg from "@/assets/hero-bg.jpg";
import { Sparkles, Heart, Award } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Image with Enhanced Gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sage-dark/90 via-primary/85 to-terracotta/70" />
        {/* Decorative Overlay Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6 animate-fade-up">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-primary-foreground text-sm font-medium tracking-wide">
              NUTRICIÓN FEMENINA CONSCIENTE
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-primary-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Transforma tu Salud
            <span className="block text-rose-200 mt-2">Hormonal Naturalmente</span>
          </h1>

          {/* Subheading */}
          <p className="text-primary-foreground/95 text-xl md:text-2xl mb-10 leading-relaxed animate-fade-up max-w-2xl mx-auto" style={{ animationDelay: "0.2s" }}>
            Descubre cómo nutrir tu cuerpo y equilibrar tus hormonas a través de la alimentación consciente y el poder de tu ciclo menstrual
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up mb-12" style={{ animationDelay: "0.3s" }}>
            <a
              href="#programas"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-primary font-semibold text-lg rounded-xl hover:bg-white/95 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Explorar Programas
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center justify-center px-10 py-5 border-2 border-white/80 text-white font-semibold text-lg rounded-xl hover:bg-white/10 backdrop-blur-sm hover:scale-105 transition-all duration-300"
            >
              Consulta Gratuita
            </a>
          </div>

          {/* Social Proof Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-3 text-primary-foreground">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Heart className="w-6 h-6 text-rose-200" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold">+500</div>
                <div className="text-sm opacity-90">Mujeres transformadas</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Award className="w-6 h-6 text-gold" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold">+8</div>
                <div className="text-sm opacity-90">Años de experiencia</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
