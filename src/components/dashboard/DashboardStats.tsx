import { useState, useEffect } from "react";
import { BookOpen, GraduationCap, Trophy, PlayCircle, Clock, CheckCircle, ArrowRight, Sparkles, Star, Apple, Carrot, Leaf, Cherry } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser, useAuth } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";

interface StatCard {
  icon: React.ElementType;
  value: number;
  label: string;
}

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  progress: number;
  thumbnail: string;
  lessons: number;
  completedLessons: number;
  category: string;
  isNew?: boolean;
  isFeatured?: boolean;
  color_theme?: string;
  border_theme?: string;
}

// Category colors for nutrition-themed badges
const categoryColors: Record<string, string> = {
  "MENOPAUSIA": "bg-primary text-white",
  "FERTILIDAD": "bg-primary text-white",
  "CICLO MENSTRUAL": "bg-primary text-white",
  "MEMBRESIA": "bg-gold text-black", // Gold is acceptable for premium membership
  "DEFAULT": "bg-primary text-white"
};

// Fruit icons for progress milestones
const progressIcons = [
  { threshold: 25, icon: "🌱", label: "Semilla plantada" },
  { threshold: 50, icon: "🥬", label: "Creciendo" },
  { threshold: 75, icon: "🌸", label: "Floreciendo" },
  { threshold: 100, icon: "🍎", label: "Cosecha completa" },
];

const DashboardStats = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<StatCard[]>([
    { icon: BookOpen, value: 0, label: "Cursos inscritos" },
    { icon: GraduationCap, value: 0, label: "Cursos activos" },
    { icon: Trophy, value: 0, label: "Cursos completados" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoursesAndProgress = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Sync Clerk token with Supabase
        const token = await getToken({ template: "supabase" });
        if (token) {
          await supabase.auth.setSession({
            access_token: token,
            refresh_token: "",
          });
        }

        // Fetch all courses
        const { data: coursesData, error: coursesError } = await supabase
          .from("courses")
          .select("*")
          .order("created_at", { ascending: false });

        if (coursesError) throw coursesError;

        // Fetch all videos for each course to count lessons
        const { data: videosData } = await supabase
          .from("course_videos")
          .select("id, course_id");

        // Fetch user's video progress
        const { data: progressData } = await supabase
          .from("video_progress")
          .select("video_id, is_completed")
          .eq("user_id", user.id);

        // Create a map of video_id to completion status
        const progressMap = new Map<string, boolean>();
        progressData?.forEach(p => {
          progressMap.set(p.video_id, p.is_completed || false);
        });

        // Create a map of course_id to video count
        const videoCountMap = new Map<string, string[]>();
        videosData?.forEach(v => {
          const existing = videoCountMap.get(v.course_id) || [];
          existing.push(v.id);
          videoCountMap.set(v.course_id, existing);
        });

        // Process courses with progress data
        const processedCourses: Course[] = (coursesData || []).map(course => {
          const courseVideoIds = videoCountMap.get(course.id) || [];
          const totalLessons = courseVideoIds.length;
          const completedLessons = courseVideoIds.filter(vid => progressMap.get(vid)).length;
          const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

          // Determine category from title or use default
          let category = "DEFAULT";
          const titleLower = course.title.toLowerCase();
          if (titleLower.includes("meno") || titleLower.includes("menopausia")) {
            category = "MENOPAUSIA";
          } else if (titleLower.includes("fertil")) {
            category = "FERTILIDAD";
          } else if (titleLower.includes("ciclo") || titleLower.includes("menstrual")) {
            category = "CICLO MENSTRUAL";
          } else if (titleLower.includes("membri") || titleLower.includes("membresia")) {
            category = "MEMBRESIA";
          }

          // Check if course is new (created within last 30 days)
          const createdDate = new Date(course.created_at);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const isNew = createdDate > thirtyDaysAgo;

          return {
            id: course.id,
            slug: course.slug,
            title: course.title,
            description: course.description,
            progress,
            thumbnail: course.image_url || "https://bu-cdn.tiendup.com/business/42060/products/g52XY2_68c0a4b6bea22_medium.png",
            lessons: totalLessons,
            completedLessons,
            category,
            isNew,
            isFeatured: course.is_featured,
          };
        });

        setCourses(processedCourses);

        // Calculate stats
        const enrolled = processedCourses.filter(c => c.completedLessons > 0 || c.progress > 0).length;
        const active = processedCourses.filter(c => c.progress > 0 && c.progress < 100).length;
        const completed = processedCourses.filter(c => c.progress === 100).length;

        setStats([
          { icon: BookOpen, value: enrolled, label: "Cursos inscritos" },
          { icon: GraduationCap, value: active, label: "Cursos activos" },
          { icon: Trophy, value: completed, label: "Cursos completados" },
        ]);

      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndProgress();
  }, [user, getToken]);

  // Get featured courses (prioritize featured flag, then most recent)
  const featuredCourses = courses
    .sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    })
    .slice(0, 3);

  // Get the appropriate progress icon based on progress percentage
  const getProgressIcon = (progress: number) => {
    for (let i = progressIcons.length - 1; i >= 0; i--) {
      if (progress >= progressIcons[i].threshold) {
        return progressIcons[i];
      }
    }
    return { threshold: 0, icon: "🌱", label: "Comenzando" };
  };
  const gradients = [
    "from-black/5 to-black/10",
    "from-black/5 to-black/10",
    "from-black/5 to-black/10",
  ];

  return (
    <div className="space-y-8">
      {/* Compact Stats Overview - Horizontal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className={`relative group bg-white/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 flex items-center gap-4 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
            >
              {/* Gradient accent */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-20 transition-opacity`} />

              {/* Icon */}
              <div className={`relative z-10 w-14 h-14 rounded-xl bg-sage flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                <Icon size={24} className="text-white" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex-1">
                <span className="text-3xl font-bold text-foreground block">{stat.value}</span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Learning Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage flex items-center justify-center">
              <PlayCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-foreground uppercase tracking-tight">Mis Programas</h2>
          </div>
          <Link to="/aula-virtual" className="text-primary hover:text-primary/80 text-sm font-semibold flex items-center gap-1 transition-colors">
            Ver todos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Course Cards Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/80 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted/30" />
                <div className="p-5 space-y-4">
                  <div className="h-6 bg-muted/30 rounded w-3/4" />
                  <div className="h-4 bg-muted/20 rounded w-1/2" />
                  <div className="h-10 bg-muted/20 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => {
              const progressMilestone = getProgressIcon(course.progress);
              const categoryColor = categoryColors[course.category] || categoryColors["DEFAULT"];

              return (
                <Link
                  key={course.id}
                  to={`/cursos/${course.slug}`}
                  className="group relative rounded-3xl bg-white overflow-hidden flex flex-col aspect-[9/16] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-sm"
                  style={{
                    borderColor: course.border_theme || 'transparent',
                    borderWidth: course.border_theme ? '4px' : '0px',
                    borderStyle: 'solid'
                  }}
                >
                  {/* Image Container - Top 45% */}
                  <div className="h-[45%] w-full relative bg-muted/20 border-b overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Progress Badge */}
                    {course.progress > 0 && course.progress < 100 && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 backdrop-blur-md text-primary text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm border border-primary/20">
                          {course.progress}%
                        </span>
                      </div>
                    )}

                    {/* Completed Badge */}
                    {course.progress === 100 && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                          <CheckCircle className="w-3 h-3" />
                          Completado
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Container - Bottom 55% */}
                  <div
                    className="h-[55%] w-full flex flex-col p-5 text-left transition-colors duration-300"
                    style={{ backgroundColor: course.color_theme || '#ffffff' }}
                  >
                    {(() => {
                      const bgColor = course.color_theme || '#ffffff';
                      const isWhite = bgColor.toLowerCase() === '#ffffff';

                      const textColor = isWhite ? '#111827' : '#ffffff';
                      const subTextColor = isWhite ? '#6b7280' : 'rgba(255,255,255,0.8)';
                      const badgeBg = isWhite ? 'rgba(191, 89, 103, 0.1)' : 'rgba(255,255,255,0.2)';
                      const badgeText = isWhite ? '#bf5967' : '#ffffff';

                      return (
                        <>
                          {/* Category Badge */}
                          <div className="mb-3">
                            <span
                              className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-sm inline-block"
                              style={{ backgroundColor: badgeBg, color: badgeText }}
                            >
                              {course.category || "PROGRAMA"}
                            </span>
                          </div>

                          {/* Title */}
                          <h3
                            className="font-serif text-xl font-bold leading-tight line-clamp-2 mb-2"
                            style={{ color: textColor }}
                          >
                            {course.title}
                          </h3>

                          {/* Meta Info */}
                          <div className="flex items-center gap-4 text-xs mb-4" style={{ color: subTextColor }}>
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>{course.completedLessons} / {course.lessons} lecciones</span>
                            </div>
                          </div>

                          {/* Footer Button */}
                          <div className="mt-auto pt-4 border-t" style={{ borderColor: isWhite ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)' }}>
                            <Button
                              size="sm"
                              className={`w-full rounded-full font-bold text-xs uppercase tracking-wider ${isWhite
                                ? "bg-primary text-white hover:bg-primary/90"
                                : "bg-white text-primary hover:bg-white/90"
                                }`}
                            >
                              {course.progress === 0 ? "Comenzar" : course.progress === 100 ? "Repasar" : "Continuar"}
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
        ) : (
          <div className="text-center py-12 bg-white/50 rounded-2xl border border-dashed border-border/50">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage-light/20 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-sage" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No hay cursos disponibles</h3>
            <p className="text-muted-foreground mb-4">Los cursos apareceran aqui cuando esten creados</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/aula-virtual"
          className="group relative bg-gradient-to-br from-primary/10 to-rose/10 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center hover:shadow-card transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-rose/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary to-rose flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <p className="font-semibold text-foreground">Explorar Cursos</p>
          </div>
        </Link>

        <Link
          to="/dashboard/profile"
          className="group relative bg-gradient-to-br from-sage-light/10 to-terracotta/10 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center hover:shadow-card transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-sage-light/20 to-terracotta/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-sage-dark to-terracotta flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <p className="font-semibold text-foreground">Mi Perfil</p>
          </div>
        </Link>

        <Link
          to="/dashboard/certificates"
          className="group relative bg-gradient-to-br from-gold/10 to-terracotta/10 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center hover:shadow-card transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-terracotta/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-gold to-terracotta flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <p className="font-semibold text-foreground">Certificados</p>
          </div>
        </Link>

        <a
          href="#contacto"
          className="group relative bg-gradient-to-br from-rose/10 to-primary/10 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center hover:shadow-card transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-rose/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-rose to-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <p className="font-semibold text-foreground">Soporte</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default DashboardStats;
