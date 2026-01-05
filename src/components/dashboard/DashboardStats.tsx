import { BookOpen, GraduationCap, Trophy } from "lucide-react";

interface StatCard {
  icon: React.ElementType;
  value: number;
  label: string;
}

const stats: StatCard[] = [
  { icon: BookOpen, value: 0, label: "Cursos inscritos" },
  { icon: GraduationCap, value: 0, label: "Cursos activos" },
  { icon: Trophy, value: 0, label: "Cursos completados" },
];

const DashboardStats = () => {
  const gradients = [
    "from-primary/10 via-sage-light/10 to-rose/10",
    "from-rose/10 via-terracotta/10 to-gold/10",
    "from-terracotta/10 via-primary/10 to-sage-light/10",
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div
            key={index}
            className={`relative group bg-gradient-to-br ${gradients[index]} backdrop-blur-sm border border-border/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-1 overflow-hidden`}
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-md" />

            {/* Gradient accent on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

            {/* Content */}
            <div className="relative z-10">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradients[index]} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={32} className="text-primary" />
              </div>
              <span className="text-5xl font-bold text-foreground mb-3 block group-hover:scale-105 transition-transform">{stat.value}</span>
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
