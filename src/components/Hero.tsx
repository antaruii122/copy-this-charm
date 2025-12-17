import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-2xl">
          <p className="text-primary-foreground text-sm font-medium tracking-widest mb-4 animate-fade-up">
            NUTRICIÓN FEMENINA
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary-foreground leading-tight mb-6 animate-fade-up">
            NUTFEM
          </h1>
          <p className="text-primary-foreground/90 text-lg md:text-xl mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Te acompaño a nutrir tu cuerpo y equilibrar tus hormonas a través de la alimentación consciente y el conocimiento de tu ciclo menstrual.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <a
              href="#programas"
              className="inline-flex items-center justify-center px-8 py-4 bg-background text-primary font-medium rounded-lg hover:bg-background/90 transition-colors"
            >
              Ver programas
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-foreground text-primary-foreground font-medium rounded-lg hover:bg-primary-foreground/10 transition-colors"
            >
              Consulta gratuita
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
