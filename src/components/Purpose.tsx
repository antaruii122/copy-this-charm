import { Heart, Leaf, Moon } from "lucide-react";

const Purpose = () => {
  const features = [
    {
      icon: Heart,
      title: "Un enfoque Integral",
      description: "Trabajo con tu cuerpo, mente y emociones para lograr una transformación profunda y duradera.",
    },
    {
      icon: Leaf,
      title: "Trato anticonceptivo en ti",
      description: "Te ayudo a entender tu ciclo menstrual y usar métodos naturales para tu bienestar hormonal.",
    },
    {
      icon: Moon,
      title: "Énfasis y Atención para Mujeres de la Nueva Era",
      description: "Programas diseñados especialmente para mujeres que buscan reconectar con su esencia femenina.",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
            Nuestro Propósito
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Te acompaño en tu camino hacia el bienestar integral, ayudándote a reconectar con tu cuerpo, 
            entender tus ciclos naturales y alcanzar el equilibrio que mereces.
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
