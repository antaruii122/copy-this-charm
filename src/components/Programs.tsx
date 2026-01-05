import { Star, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Programs = () => {
  const programs = [
    {
      id: "meno-21-dias",
      title: "MENO: 21 Días de Transformación en Menopausia",
      description: "Programa online para transitar la menopausia con vitalidad, equilibrio y una nutrición adaptada a esta etapa.",
      price: "$1,200",
      rating: 5,
      tag: "Destacado",
    },
    {
      id: "nutricion-fertilidad",
      title: "Nutrición en Fertilidad",
      description: "Programa nutricional diseñado para profesionales de la salud y mujeres que buscan optimizar su fertilidad.",
      price: "$800",
      rating: 5,
    },
    {
      id: "membresia-nutriendo-me",
      title: "Membresía Nutriendo-Me",
      description: "Acceso mensual a contenido exclusivo, recetas, guías y acompañamiento continuo para nutrir tu ciclo.",
      price: "$99/mes",
      rating: 5,
      tag: "Popular",
    },
    {
      id: "masterclass-nutrir-ciclo",
      title: "Masterclass: Nutrir tu Ciclo",
      description: "Descubre cómo nutrir tu ciclo y transformar tu bienestar hormonal con alimentación consciente.",
      price: "$150",
      rating: 5,
    },
    {
      id: "explorando-fertilidad",
      title: "Explorando la Fertilidad",
      description: "Un espacio seguro y educativo para descubrir sobre fertilidad, nutrición y bienestar reproductivo.",
      price: "Gratis",
      rating: 5,
      tag: "Gratuito",
    },
    {
      id: "academia-nutfem",
      title: "Academia NUTFEM: 5 Módulos de Contenido",
      description: "Acceso en diferido para disfrutar y aprender a tu ritmo. Masterclass completas sobre nutrición femenina.",
      price: "$450",
      rating: 5,
    },
  ];

  return (
    <section id="programas" className="py-20 md:py-32 bg-gradient-to-b from-background to-cream">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">PROGRAMAS TRANSFORMADORES</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Elige tu Camino de Bienestar
          </h2>
          <p className="text-muted-foreground text-xl">
            Programas diseñados para acompañarte en cada etapa de tu vida hormonal
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-2 border border-border/50"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 via-rose/20 to-terracotta/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-terracotta/20 group-hover:scale-110 transition-transform duration-500" />
                {program.tag && (
                  <span className="absolute top-4 left-4 px-4 py-2 bg-white/95 backdrop-blur-sm text-primary text-xs font-bold rounded-full shadow-lg">
                    {program.tag}
                  </span>
                )}
                <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                </div>
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
                <h3 className="font-serif text-xl text-foreground mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
                  {program.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {program.description}
                </p>
                <div className="flex items-center justify-between mb-4 pt-4 border-t border-border/50">
                  <span className="text-primary font-bold text-2xl">
                    {program.price}
                  </span>
                </div>
                <Link to={`/aula-virtual/${program.id}`}>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-xl group-hover:scale-105 transition-transform"
                  >
                    Comenzar Ahora
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-sage-dark hover:from-sage-dark hover:to-primary text-primary-foreground px-12 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Ver Todos los Programas
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Programs;
