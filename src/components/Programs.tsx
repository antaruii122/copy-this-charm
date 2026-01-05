import { Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Programs = () => {
  const programs = [
    {
      id: "meno-21-dias",
      title: "MENO: 21 Días de Transformación en Menopausia",
      description: "Programa online para transitar la menopausia con vitalidad, equilibrio y una nutrición adaptada a esta etapa.",
      price: "$1,200",
      category: "MENOPAUSIA",
      rating: 5,
      tag: "Destacado",
      image: "https://bu-cdn.tiendup.com/business/42060/products/g52XY2_68c0a4b6bea22_medium.png"
    },
    {
      id: "nutricion-fertilidad",
      title: "Nutrición en Fertilidad Natural y Asistida",
      description: "Programa nutricional diseñado para profesionales de la salud y mujeres que buscan optimizar su fertilidad.",
      price: "$800",
      category: "FERTILIDAD",
      rating: 5,
      image: "https://bu-cdn.tiendup.com/business/42060/products/DxRXeA_685966ed21eb9_medium.png"
    },
    {
      id: "membresia-nutriendo-me",
      title: "Membresía Nutriendo-Me",
      description: "Acceso mensual a contenido exclusivo, recetas, guías y acompañamiento continuo para nutrir tu ciclo.",
      price: "$99/mes",
      category: "MEMBRESÍA",
      rating: 5,
      tag: "Popular",
      image: "https://bu-cdn.tiendup.com/business/42060/themes/lite/assets/img/o_1j4o3ggt6cke129v15ahohsit74k.jpg"
    },
    {
      id: "masterclass-nutrir-ciclo",
      title: "Masterclass: Nutrir tu Ciclo",
      description: "Descubre cómo nutrir tu ciclo y transformar tu bienestar hormonal con alimentación consciente.",
      price: "$150",
      category: "CICLO MENSTRUAL",
      rating: 5,
      image: "https://bu-cdn.tiendup.com/business/42060/products/g52XY2_68c0a4b6bea22_medium.png"
    },
    {
      id: "explorando-fertilidad",
      title: "Explorando la Fertilidad",
      description: "Un espacio seguro y educativo para descubrir sobre fertilidad, nutrición y bienestar reproductivo.",
      price: "Gratis",
      category: "FERTILIDAD",
      rating: 5,
      tag: "Gratuito",
      image: "https://bu-cdn.tiendup.com/business/42060/products/W097PE_68c0a742073a6_medium.png"
    },
    {
      id: "fertilidad-autocuidado",
      title: "Fertilidad desde el Autocuidado",
      description: "Curso completo sobre cómo mejorar tu fertilidad desde el autocuidado integral y la nutrición consciente.",
      price: "$450",
      category: "FERTILIDAD",
      rating: 5,
      image: "https://bu-cdn.tiendup.com/business/42060/products/pP9155_692121c0867d2_medium.jpg"
    },
  ];

  return (
    <section id="programas" className="py-20 md:py-32 bg-gradient-to-b from-background to-cream">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Cursos & Recursos
          </h2>
          <p className="text-muted-foreground text-xl">
            Programas diseñados para acompañarte en cada etapa de tu vida hormonal
          </p>
        </div>

        {/* Programs Grid - Diamond Wave Pattern */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 max-w-7xl mx-auto">
          {programs.map((program, index) => {
            // Diamond pattern: middle column offset, sides normal
            // Row 1: Normal, UP, Normal
            // Row 2: Normal, DOWN, Normal
            const position = index % 3; // 0=left, 1=middle, 2=right
            const row = Math.floor(index / 3); // 0=top row, 1=bottom row

            let staggerClass = '';
            if (position === 1) { // Middle column
              staggerClass = row === 0 ? 'md:-translate-y-8' : 'md:translate-y-8';
            }

            return (
              <Link
                key={index}
                to={`/aula-virtual/${program.id}`}
                className={`group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 hover:scale-105 flex flex-col ${staggerClass}`}
              >
                {/* Image Container - SQUARE 1:1 like Academia NUTFEM */}
                <div className="relative aspect-square overflow-hidden bg-white">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Category Tag - Top Left */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-md">
                      {program.category}
                    </span>
                  </div>
                  {/* Special Tags - Top Right */}
                  {program.tag && (
                    <div className="absolute top-4 right-4">
                      <span className={`inline-block px-3 py-1.5 text-white text-xs font-bold uppercase tracking-wider rounded-md ${program.tag === "Destacado" ? "bg-rose-dark" :
                        program.tag === "Gratuito" ? "bg-green-600" :
                          "bg-gold"
                        }`}>
                        {program.tag}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content - White Background like TiendUp */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Title */}
                  <h3 className="font-serif text-xl md:text-2xl text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {program.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm md:text-base mb-4 line-clamp-3 flex-grow">
                    {program.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-gold mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < program.rating ? "fill-current" : "text-muted"}`}
                      />
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <span className="text-primary font-bold text-2xl md:text-3xl">
                      {program.price}
                    </span>
                    <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                      <span className="text-sm">Ver más</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white px-12 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
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
