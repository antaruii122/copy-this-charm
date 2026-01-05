import { Heart, Leaf, Moon, Sparkles } from "lucide-react";

const Purpose = () => {
  const features = [
    {
      icon: Heart,
      title: "Nutrición Hormonal",
      description: "Aprende a alimentarte según las fases de tu ciclo menstrual para optimizar tu energía y bienestar hormonal.",
      gradient: "bg-gradient-rose",
      delay: "0s"
    },
    {
      icon: Leaf,
      title: "Fertilidad Natural",
      description: "Descubre cómo la nutrición puede potenciar tu fertilidad y preparar tu cuerpo para la maternidad de forma natural.",
      gradient: "bg-gradient-primary",
      delay: "0.1s"
    },
    {
      icon: Moon,
      title: "Ciclo Menstrual Consciente",
      description: "Entiende las etapas de tu ciclo vital y nutre tu cuerpo según lo que necesita en cada fase.",
      gradient: "bg-gradient-sunset",
      delay: "0.2s"
    },
  ];

  return (
    <section className="relative py-24 md:py-40 bg-background overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-rose opacity-10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

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

          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            Soy nutricionista especializada en salud hormonal femenina. Te acompaño a entender
            tu ciclo menstrual y nutrir tu cuerpo en cada fase para alcanzar el <span className="text-gradient font-semibold">equilibrio que mereces</span>.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-gradient-card rounded-3xl p-8 md:p-10 shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-3 border border-border/50 hover:border-primary/30 relative overflow-hidden animate-fade-up"
              style={{ animationDelay: feature.delay }}
            >
              {/* Decorative corner element */}
              <div className={`absolute -top-12 -right-12 w-32 h-32 ${feature.gradient} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />

              {/* Icon with gradient background */}
              <div className={`w-20 h-20 ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:glow-rose transition-all duration-300 relative`}>
                <feature.icon className="w-10 h-10 text-white" />
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
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
