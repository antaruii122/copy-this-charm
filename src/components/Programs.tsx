import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import { Tables } from "@/integrations/supabase/types";

// Temporarily extending the type until the database schema is updated
type Program = Tables<"courses"> & {
  category?: string;
  tag?: string;
  card_style?: string;
  badge_text?: string;
  original_price?: string;
};

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPrograms(data || []);
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

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
                to={`/cursos/${program.slug}`}
                className={`group relative rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 hover:scale-105 flex flex-col aspect-[9/16] ${staggerClass}`}
              >
                {/* Image Container - Top 45% */}
                <div className="h-[45%] w-full relative bg-muted/20 border-b overflow-hidden">
                  <img
                    src={program.image_url || "/placeholder.svg"}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Featured Tag */}
                  {program.is_featured && (
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full uppercase border border-primary/20 shadow-sm">
                        Destacado
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Container - Bottom 55% */}
                <div className={`h-[55%] w-full flex flex-col p-5 transition-colors duration-300 ${program.card_style === 'elegant' ? "bg-[#F4F6F4]" : // Sage Tint
                    program.card_style === 'bold' ? "bg-primary text-primary-foreground" :
                      "bg-white" // Standard Minimal
                  }`}>
                  {/* Badge */}
                  <div className="mb-3">
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-sm ${program.card_style === 'bold' ? "bg-white/20 text-white" : "bg-primary/5 text-primary"
                      }`}>
                      {program.badge_text || program.category || "CURSO"}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className={`font-serif text-xl font-bold leading-tight mb-2 line-clamp-2 ${program.card_style === 'bold' ? "text-white" : "text-gray-900"
                    }`}>
                    {program.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-sm line-clamp-3 mb-4 flex-1 ${program.card_style === 'bold' ? "text-white/80" : "text-muted-foreground"
                    }`}>
                    {program.description || "Descubre el poder de transformar tu salud hormonal con este programa especializado."}
                  </p>

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
    </section >
  );
};

export default Programs;
