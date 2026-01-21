import { Heart, Leaf, Moon, Sparkles } from "lucide-react";
import purposeBg from "@/assets/Gemini_Generated_Image_d1gicwd1gicwd1gi.png";
import nutricionImg from "@/assets/nutricion_hormonal.png";
import fertilidadImg from "@/assets/fertilidad_natural.png";
import cicloImg from "@/assets/ciclo_menstrual.png";

const Purpose = () => {
  const features = [
    {
      icon: Heart,
      title: "Nutrición Hormonal",
      description: "Aprende a alimentarte según las fases de tu ciclo menstrual para optimizar tu energía y bienestar hormonal.",
      gradient: "bg-gradient-rose",
      delay: "0s",
      image: nutricionImg
    },
    {
      icon: Leaf,
      title: "Fertilidad Natural",
      description: "Descubre cómo la nutrición puede potenciar tu fertilidad y preparar tu cuerpo para la maternidad de forma natural.",
      gradient: "bg-gradient-primary",
      delay: "0.1s",
      image: fertilidadImg
    },
    {
      icon: Moon,
      title: "Ciclo Menstrual Consciente",
      description: "Entiende las etapas de tu ciclo vital y nutre tu cuerpo según lo que necesita en cada fase.",
      gradient: "bg-gradient-sunset",
      delay: "0.2s",
      image: cicloImg
    },
  ];

  return (
    <section className="relative py-24 md:py-40 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${purposeBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* White overlay for readability - drastically reduced to show image */}
        <div className="absolute inset-0 bg-white/20" />
      </div>

      {/* Decorative Background Elements - Reduced opacity */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-rose opacity-10 rounded-full blur-3xl animate-float z-0" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-float z-0" style={{ animationDelay: "1.5s" }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-rose rounded-full mb-6 shadow-lg">
            <Sparkles className="w-5 h-5 text-white animate-pulse-slow" />
            <span className="text-white text-sm font-bold tracking-wider">✨ BIENVENIDA ✨</span>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
            <span className="block text-gradient">Bienvenida a</span>
            <span className="block text-foreground font-bold mt-2">Alimenta tu Fertilidad</span>
          </h2>

          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-sm border border-white/40 max-w-4xl mx-auto">
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Soy nutricionista especializada en salud hormonal femenina. Te acompaño a entender
              tu ciclo menstrual y nutrir tu cuerpo en cada fase para alcanzar el <span className="text-gradient font-semibold">equilibrio que mereces</span>.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-gradient-card rounded-3xl p-6 shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-3 border border-border/50 hover:border-primary/30 relative overflow-hidden animate-fade-up"
              style={{ animationDelay: feature.delay }}
            >
              {/* Decorative corner element */}
              <div className={`absolute -top-12 -right-12 w-32 h-32 ${feature.gradient} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />

              {/* Rectangular Header / Image Container */}
              <div className={`w-full aspect-[4/3] rounded-2xl ${feature.gradient} mb-6 relative overflow-hidden shadow-inner group-hover:shadow-lg transition-all duration-500`}>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay for icon visibility */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
              </div>

              <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-4 group-hover:text-gradient transition-all">
                {feature.title}
              </h3>

              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                {feature.description}
              </p>

              {/* Hover indicator */}
              <div className="mt-6 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                <span className="text-sm font-semibold">Descubre más</span>
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
          ))}</div>
      </div>
    </section>
  );
};

export default Purpose;
