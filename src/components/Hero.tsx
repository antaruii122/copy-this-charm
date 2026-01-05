import heroBg from "@/assets/hero-bg.jpg";
import { Sparkles, Heart, Award, Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Image with Enhanced Gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-primary opacity-90" />
        {/* Decorative Floating Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-rose opacity-20 rounded-full blur-3xl animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute bottom-20 right-16 w-48 h-48 bg-gradient-sunset opacity-20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: "0.5s" }} />

        {/* Dot Pattern Overlay */}
        <div className="absolute inset-0 dot-pattern opacity-40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Floating Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-full mb-8 animate-scale-in hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 text-gold animate-pulse-slow" />
            <span className="text-white text-sm font-bold tracking-widest">
              ✨ NUTRICIÓN FEMENINA CONSCIENTE ✨
            </span>
          </div>

          {/* Main Heading with Gradient Text */}
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl leading-tight mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <span className="block text-white font-bold">
              Transforma tu Salud
            </span>
            <span className="block text-gradient-sunset text-7xl md:text-8xl lg:text-9xl font-bold mt-4">
              Hormonal Naturalmente
            </span>
          </h1>

          {/* Subheading with Glow */}
          <p className="text-white/95 text-xl md:text-2xl lg:text-3xl mb-12 leading-relaxed animate-fade-up max-w-3xl mx-auto font-light" style={{ animationDelay: "0.2s" }}>
            Descubre cómo <span className="font-semibold text-gradient-sunset">nutrir tu cuerpo</span> y <span className="font-semibold">equilibrar tus hormonas</span> a través de la alimentación consciente
          </p>

          {/* CTA Buttons with Glow */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-up mb-16" style={{ animationDelay: "0.3s" }}>
            <a
              href="#programas"
              className="group inline-flex items-center justify-center px-12 py-6 bg-gradient-rose text-white font-bold text-lg rounded-2xl hover:scale-105 hover:glow-rose transition-all duration-300 shadow-2xl relative overflow-hidden"
            >
              <span className="relative z-10">Explorar Programas</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </a>
            <a
              href="#contacto"
              className="group inline-flex items-center justify-center px-12 py-6 border-3 border-white/90 text-white font-bold text-lg rounded-2xl hover:bg-white hover:text-primary backdrop-blur-sm hover:scale-105 transition-all duration-300 shadow-xl"
            >
              Consulta Gratuita
              <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
            </a>
          </div>

          {/* Social Proof Stats with Enhanced Design */}
          <div className="flex flex-wrap justify-center gap-12 md:gap-16 animate-fade-up bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-4 text-white group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-rose flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:glow-rose transition-all duration-300">
                <Heart className="w-8 h-8 text-white animate-pulse-slow" />
              </div>
              <div className="text-left">
                <div className="text-4xl font-bold font-serif">+500</div>
                <div className="text-sm opacity-90 font-medium">Mujeres transformadas</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-white group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-sunset flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:glow transition-all duration-300">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="text-4xl font-bold font-serif">+8</span>
                  <Star className="w-5 h-5 fill-gold text-gold animate-pulse-slow" />
                </div>
                <div className="text-sm opacity-90 font-medium">Años de experiencia</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <div className="w-8 h-12 border-3 border-white/60 rounded-full flex justify-center pt-2 backdrop-blur-sm bg-white/10">
          <div className="w-2 h-4 bg-white/80 rounded-full animate-pulse" />
        </div>
        <p className="text-white/70 text-xs mt-2 text-center font-medium">Scroll</p>
      </div>
    </section>
  );
};

export default Hero;
