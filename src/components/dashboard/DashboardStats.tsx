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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <div
            key={index}
            className="bg-white border border-border rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Icon size={28} className="text-primary" />
            </div>
            <span className="text-4xl font-bold text-foreground mb-2">{stat.value}</span>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
