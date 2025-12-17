import { Heart, Leaf, Moon } from "lucide-react";

const Purpose = () => {
  const features = [
    {
      icon: Heart,
      title: "Nutrición Hormonal",
      description: "Aprende a alimentarte según las fases de tu ciclo menstrual para optimizar tu energía y bienestar hormonal.",
    },
    {
      icon: Leaf,
      title: "Fertilidad Natural",
      description: "Descubre cómo la nutrición puede potenciar tu fertilidad y preparar tu cuerpo para la maternidad de forma natural.",
    },
    {
      icon: Moon,
      title: "Ciclo Menstrual Consciente",
      description: "Entiende las etapas de tu ciclo vital y nutre tu cuerpo según lo que necesita en cada fase.",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
            Bienvenida a NUTFEM
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Soy nutricionista especializada en salud hormonal femenina. Te acompaño a entender 
            tu ciclo menstrual y nutrir tu cuerpo en cada fase para alcanzar el equilibrio que mereces.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-card rounded-2xl p-8 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-xl md:text-2xl text-foreground mb-4">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Purpose;
