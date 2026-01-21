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
                  staggerClass
                )}
                style={{
                  borderColor: program.border_theme || 'transparent',
                  borderWidth: program.border_theme ? '4px' : '0px',
                  borderStyle: 'solid'
                }}
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

                <div
                  className="h-[55%] w-full flex flex-col p-5 text-left transition-colors duration-300"
                  style={{ backgroundColor: program.color_theme || '#ffffff' }}
                >
                  {(() => {
                    const bgColor = program.color_theme || '#ffffff';
                    const isWhite = bgColor.toLowerCase() === '#ffffff';

                    const textColor = isWhite ? '#111827' : '#ffffff';
                    const subTextColor = isWhite ? '#6b7280' : 'rgba(255,255,255,0.8)';
                    const badgeBg = isWhite ? 'rgba(191, 89, 103, 0.1)' : 'rgba(255,255,255,0.2)';
                    const badgeText = isWhite ? '#bf5967' : '#ffffff';

                    return (
                      <>
                        {/* Badge */}
                        <div className="mb-3">
                          <span
                            className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-sm inline-block"
                            style={{ backgroundColor: badgeBg, color: badgeText }}
                          >
                            {program.badge_text || "PROGRAMA"}
                          </span>
                        </div>

                        {/* Title */}
                        <h3
                          className="font-serif text-xl font-bold leading-tight line-clamp-2 mb-3"
                          style={{ color: textColor }}
                        >
                          {program.title}
                        </h3>

                        {/* Description */}
                        <p
                          className="text-sm line-clamp-3 mb-4 flex-1 leading-relaxed"
                          style={{ color: subTextColor }}
                        >
                          {program.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-end justify-between mt-auto pt-4 border-t" style={{ borderColor: isWhite ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)' }}>
                          <div className="flex flex-col">
                            {program.original_price && (
                              <span
                                className="text-[10px] line-through mb-0.5"
                                style={{ color: subTextColor, opacity: 0.7 }}
                              >
                                {program.original_price.toString().startsWith('$') ? program.original_price : `$${program.original_price}`}
                              </span>
                            )}
                            <span
                              className="text-lg font-bold"
                              style={{ color: textColor }}
                            >
                              {program.price ? (program.price.toString().startsWith('$') ? program.price : `$${program.price}`) : "Gratis"}
                            </span>
                          </div>

                          <Button
                            size="sm"
                            className={cn(
                              "rounded-full px-4 h-8 text-xs font-bold shadow-none",
                              isWhite
                                ? "bg-primary text-white hover:bg-primary/90"
                                : "bg-white text-primary hover:bg-white/90"
                            )}
                          >
                            Ver más
                          </Button>
                        </div>
                      </>
                    );
                  })()}
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
