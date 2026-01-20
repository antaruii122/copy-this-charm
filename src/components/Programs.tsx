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
                className={`group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 hover:scale-105 flex flex-col ${staggerClass}`}
              >
                {/* Image Container - SQUARE 1:1 like Academia NUTFEM */}
                <div className="relative aspect-square overflow-hidden bg-white">
                  <img
                    src={program.image_url || "/placeholder.svg"}
                    alt={program.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Category Tag - Top Left */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-md">
                      {program.category || "CURSO"}
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
