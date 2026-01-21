import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

import { Tables } from "@/integrations/supabase/types";

// Temporarily extending the type until the database schema is updated
type Program = Tables<"courses"> & {
  category?: string;
  tag?: string;
  card_style?: string;
  badge_text?: string;
  original_price?: string;
  border_color?: string;
  color_theme?: string;
  border_theme?: string;
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
                className={cn(
                  "group relative rounded-3xl bg-white overflow-hidden flex flex-col aspect-[9/16] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                  "shadow-sm",
                  program.border_color ? `border-2 ${program.border_color}` : "border border-border",
                  staggerClass
                )}
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

                <div className={cn(
                  "h-[55%] w-full flex flex-col p-4 text-left",
                  program.card_style === 'elegant' ? "bg-[#F4F6F4]" :
                    program.card_style === 'rose' ? "bg-[#FFF0F5]" :
                      program.card_style === 'bold' || program.card_style === 'dark' ? "bg-primary text-primary-foreground" :
                        "bg-white"
                )}>
                  {/* Badge */}
                  <div className="mb-2">
                    <span className={cn(
                      "text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm inline-block",
                      (program.card_style === 'bold' || program.card_style === 'dark') ? "bg-white/20 text-white" : "bg-primary/5 text-primary"
                    )}>
                      {program.badge_text || "PROGRAMA"}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className={cn(
                    "font-serif text-lg font-bold leading-tight line-clamp-2 mb-2",
                    (program.card_style === 'bold' || program.card_style === 'dark') ? "text-white" : "text-gray-900"
                  )}>
                    {program.title}
                  </h3>

                  {/* Description */}
                  <p className={cn(
                    "text-xs line-clamp-3 mb-4 flex-1 leading-relaxed",
                    (program.card_style === 'bold' || program.card_style === 'dark') ? "text-white/80" : "text-muted-foreground"
                  )}>
                    {program.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-end justify-between mt-auto pt-4 border-t border-border/10">
                    <div className="flex flex-col">
                      {program.original_price && (
                        <span className={cn(
                          "text-[10px] line-through mb-0.5",
                          (program.card_style === 'bold' || program.card_style === 'dark') ? "text-white/60" : "text-muted-foreground/70"
                        )}>
                          {program.original_price}
                        </span>
                      )}
                      <span className={cn(
                        "text-base font-bold",
                        (program.card_style === 'bold' || program.card_style === 'dark') ? "text-white" : "text-primary"
                      )}>
                        {program.price}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      className={cn(
                        "rounded-full px-4 h-8 text-xs font-bold shadow-none",
                        (program.card_style === 'bold' || program.card_style === 'dark')
                          ? "bg-white text-primary hover:bg-white/90"
                          : "bg-primary text-white hover:bg-primary/90"
                      )}
                    >
                      Ver más
                    </Button>
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
