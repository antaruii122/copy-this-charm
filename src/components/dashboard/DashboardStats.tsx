import { BookOpen, GraduationCap, Trophy, PlayCircle, Clock, CheckCircle, ArrowRight, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface StatCard {
  icon: React.ElementType;
  value: number;
  label: string;
}

interface Course {
  id: string;
  title: string;
  progress: number;
  thumbnail: string;
  lessons: number;
  completedLessons: number;
  duration: string;
  category: string;
  isNew?: boolean;
}

const stats: StatCard[] = [
  { icon: BookOpen, value: 0, label: "Cursos inscritos" },
  { icon: GraduationCap, value: 0, label: "Cursos activos" },
  { icon: Trophy, value: 0, label: "Cursos completados" },
];

// Featured courses that users can start or continue
const featuredCourses: Course[] = [
  {
    id: "meno-21-dias",
    title: "MENO: 21 Días de Transformación en Menopausia",
    progress: 45,
    thumbnail: "https://bu-cdn.tiendup.com/business/42060/products/g52XY2_68c0a4b6bea22_medium.png",
    lessons: 21,
    completedLessons: 9,
    duration: "3 semanas",
    category: "MENOPAUSIA",
  },
  {
    id: "nutricion-fertilidad",
    title: "Nutrición en Fertilidad Natural y Asistida",
    progress: 0,
    thumbnail: "https://bu-cdn.tiendup.com/business/42060/products/DxRXeA_685966ed21eb9_medium.png",
    lessons: 15,
    completedLessons: 0,
    duration: "2 semanas",
    category: "FERTILIDAD",
    isNew: true,
  },
  {
    id: "masterclass-nutrir-ciclo",
    title: "Masterclass: Nutrir tu Ciclo",
    progress: 100,
    thumbnail: "https://bu-cdn.tiendup.com/business/42060/products/g52XY2_68c0a4b6bea22_medium.png",
    lessons: 8,
    completedLessons: 8,
    duration: "1 semana",
    category: "CICLO MENSTRUAL",
  },
];

const DashboardStats = () => {
  const gradients = [
    "from-primary/10 via-sage-light/10 to-rose/10",
    "from-rose/10 via-terracotta/10 to-gold/10",
    "from-terracotta/10 via-primary/10 to-sage-light/10",
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
              <div className={`relative z-10 w-14 h-14 rounded-xl bg-gradient-to-br ${gradients[index]} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform flex-shrink-0`}>
                <Icon size={24} className="text-primary" />
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-sage-dark flex items-center justify-center">
              <PlayCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-foreground">Continúa Aprendiendo</h2>
          </div>
          <Link to="/aula-virtual" className="text-primary hover:text-primary/80 text-sm font-semibold flex items-center gap-1 transition-colors">
            Ver todos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Course Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <Link
              key={course.id}
              to={`/aula-virtual/${course.id}`}
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
                  <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md">
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

                {/* Progress Overlay */}
                {course.progress > 0 && course.progress < 100 && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-3">
                    <div className="w-full px-3">
                      <div className="w-full h-2 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-rose rounded-full transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Completed Badge */}
                {course.progress === 100 && (
                  <div className="absolute inset-0 bg-gradient-to-t from-green-600/80 via-transparent to-transparent flex items-end justify-center pb-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold">
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
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                {/* Progress Text */}
                {course.progress > 0 && course.progress < 100 && (
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <span className="text-sm font-medium text-muted-foreground">
                      {course.progress}% completado
                    </span>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-primary to-rose text-white hover:scale-105 transition-transform"
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
          ))}
        </div>
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
