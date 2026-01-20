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
}

// Category colors for nutrition-themed badges
const categoryColors: Record<string, string> = {
  "MENOPAUSIA": "bg-black text-white",
  "FERTILIDAD": "bg-black text-white",
  "CICLO MENSTRUAL": "bg-black text-white",
  "MEMBRESIA": "bg-[#D4AF37] text-black",
  "DEFAULT": "bg-black text-white"
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
              <div className={`relative z-10 w-14 h-14 rounded-xl bg-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
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
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
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
                  to={`/aprender/${course.slug}`}
                  className="group relative bg-white/80 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Course Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-cream to-sage-light/20 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg shadow-md ${categoryColor}`}>
                        {course.category}
                      </span>
                    </div>

                    {/* New Badge */}
                    {course.isNew && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md">
                          <Sparkles className="w-3 h-3" />
                          Nuevo
                        </span>
                      </div>
                    )}

                    {/* Progress Overlay with Nutrition Icons */}
                    {course.progress > 0 && course.progress < 100 && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-3">
                        <div className="w-full px-3">
                          {/* Progress bar with fruit milestone markers */}
                          <div className="relative w-full h-3 bg-white/20 backdrop-blur-sm rounded-full overflow-visible">
                            <div
                              className="h-full bg-gradient-to-r from-sage to-primary rounded-full transition-all duration-500 relative"
                              style={{ width: `${course.progress}%` }}
                            >
                              {/* Current progress icon */}
                              <span className="absolute -right-2 -top-1 text-lg drop-shadow-md">
                                ✨
                              </span>
                            </div>
                            {/* Milestone markers */}
                            <div className="absolute inset-0 flex justify-between items-center px-1">
                              {progressIcons.map((milestone, idx) => (
                                <span
                                  key={idx}
                                  className={`text-xs ${course.progress >= milestone.threshold ? 'opacity-100' : 'opacity-30'}`}
                                  style={{ position: 'absolute', left: `${milestone.threshold - 2}%` }}
                                >
                                  {course.progress >= milestone.threshold ? "✦" : "○"}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Completed Badge */}
                    {course.progress === 100 && (
                      <div className="absolute inset-0 bg-gradient-to-t from-green-600/80 via-transparent to-transparent flex items-end justify-center pb-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold">
                          <span className="text-lg">🍎</span>
                          <CheckCircle className="w-4 h-4" />
                          Completado
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="p-5 space-y-4">
                    {/* Title */}
                    <h3 className="font-serif text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.completedLessons} / {course.lessons} lecciones</span>
                      </div>
                      {course.progress > 0 && course.progress < 100 && (
                        <div className="flex items-center gap-1 text-sage-dark">
                          <span>{progressMilestone.icon}</span>
                          <span className="font-medium">{progressMilestone.label}</span>
                        </div>
                      )}
                    </div>

                    {/* Progress Text */}
                    {course.progress > 0 && course.progress < 100 && (
                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <span className="text-sm font-medium text-muted-foreground">
                          {course.progress}% completado
                        </span>
                        <Button
                          size="sm"
                          className="bg-black text-white hover:bg-neutral-800 transition-all px-6 rounded-full font-bold uppercase text-[10px] tracking-widest"
                        >
                          Continuar
                        </Button>
                      </div>
                    )}

                    {/* Start Button */}
                    {course.progress === 0 && (
                      <div className="pt-2 border-t border-border/50">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-all"
                        >
                          <span className="mr-2">🌱</span>
                          Comenzar curso
                        </Button>
                      </div>
                    )}

                    {/* Review Button for Completed */}
                    {course.progress === 100 && (
                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <div className="flex items-center gap-1 text-gold">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all"
                        >
                          Revisar
                        </Button>
                      </div>
                    )}
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
