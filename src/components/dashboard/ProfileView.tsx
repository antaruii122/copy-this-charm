import { useUser } from "@clerk/clerk-react";
import { Mail, Phone, User, Calendar, Briefcase, FileText } from "lucide-react";

const ProfileView = () => {
  const { user } = useUser();

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const profileData = [
    { label: "Fecha de registro", value: formatDate(user?.createdAt), icon: Calendar },
    { label: "Nombre", value: user?.firstName || "-", icon: User },
    { label: "Apellidos", value: user?.lastName || "-", icon: User },
    { label: "Nombre de usuario", value: user?.username || "-", icon: User },
    { label: "Correo electrónico", value: user?.primaryEmailAddress?.emailAddress || "-", icon: Mail },
    { label: "Número de teléfono", value: user?.primaryPhoneNumber?.phoneNumber || "-", icon: Phone },
    { label: "Habilidad/Ocupación", value: "-", icon: Briefcase },
    { label: "Biografía", value: "-", icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-sage-dark flex items-center justify-center">
          <User className="w-6 h-6 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Mi perfil</h1>
      </div>

      {/* Profile cards grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {profileData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="relative group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
            >
              {/* Gradient accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-rose/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 flex items-start gap-4">
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-sage-light/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    {item.label}
                  </p>
                  <p className="text-foreground font-semibold break-words">
                    {item.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileView;
