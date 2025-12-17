import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const Programs = () => {
  const programs = [
    {
      title: "ATRÉVETE DEEPNA: Estudia a conocer el Ayurveda - Afina y pon tu Bienestar y la libertad...",
      price: "Gratis",
      rating: 5,
      tag: "Nuevo",
    },
    {
      title: "Programa Grupal: Hormonas Equilibradas, Soy hecha de Ayurveda y Autoconocimiento",
      price: "$1,500",
      originalPrice: "$2,000",
      rating: 5,
    },
    {
      title: "Consultoría de Cielo Ayurveda: Un viaje de Autoconocimiento y Nutrición",
      price: "$200",
      rating: 5,
    },
    {
      title: "Alimentación y Nutrición Consciente: Guía a Proporciones Ayurveda",
      price: "$350",
      rating: 4,
    },
    {
      title: "Mide tu ciclo: Aprende a Dígela que el Ayurveda Semina para tu salud Óptimo",
      price: "$180",
      rating: 5,
    },
    {
      title: "Introducción Básica al Ayurveda: Fundamentos en Ayurveda",
      price: "Gratis",
      rating: 5,
      tag: "Popular",
    },
  ];

  return (
    <section id="programas" className="py-20 md:py-32 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
            Descubre nuestros programas
          </h2>
          <p className="text-muted-foreground text-lg">
            Cursos, talleres y consultorías diseñados para tu transformación
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <div
              key={index}
              className="bg-background rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-[4/3] bg-muted relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10" />
                {program.tag && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    {program.tag}
                  </span>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-1 text-gold mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < program.rating ? "fill-current" : "text-muted"}`}
                    />
                  ))}
                </div>
                <h3 className="font-serif text-lg text-foreground mb-4 line-clamp-2 min-h-[3.5rem]">
                  {program.title}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-primary font-semibold text-xl">
                    {program.price}
                  </span>
                  {program.originalPrice && (
                    <span className="text-muted-foreground line-through text-sm">
                      {program.originalPrice}
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Ver más
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
          >
            Ver todos los programas
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Programs;
