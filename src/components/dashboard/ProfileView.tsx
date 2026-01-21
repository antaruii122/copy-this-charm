import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Mail, Phone, User, Calendar, Briefcase, FileText, Save, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProfileViewProps {
  isEditing?: boolean;
}

const ProfileView = ({ isEditing = false }: ProfileViewProps) => {
  const { user } = useUser();
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
    occupation: "",
    bio: "",
  });

  // Sync state with user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        phone: (user.unsafeMetadata?.phone as string) || user.primaryPhoneNumber?.phoneNumber || "",
        occupation: (user.unsafeMetadata?.occupation as string) || "",
        bio: (user.unsafeMetadata?.bio as string) || "",
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await user.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          phone: formData.phone,
          occupation: formData.occupation,
          bio: formData.bio,
        },
      });
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error al actualizar el perfil");
    } finally {
      setIsSaving(false);
    }
  };

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

  const renderField = (label: string, value: string, icon: any, fieldKey: string, isTextArea = false, isReadOnly = false) => {
    const Icon = icon;
    return (
      <div className="relative group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1">
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
              {label}
            </p>
            {isEditing && !isReadOnly ? (
              isTextArea ? (
                <Textarea
                  value={value}
                  onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                  className="mt-1 bg-white/50 min-h-[100px]"
                />
              ) : (
                <Input
                  value={value}
                  onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                  className="mt-1 bg-white/50 h-8"
                />
              )
            ) : (
              <p className="text-foreground font-semibold break-words whitespace-pre-wrap">
                {value || "-"}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-sage-dark flex items-center justify-center">
            <User className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Mi perfil</h1>
        </div>
        {isEditing && (
          <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar Cambios
          </Button>
        )}
      </div>

      {/* Profile cards grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {renderField("Fecha de registro", formatDate(user?.createdAt), Calendar, "createdAt", false, true)}
        {renderField("Nombre", formData.firstName, User, "firstName")}
        {renderField("Apellidos", formData.lastName, User, "lastName")}
        {renderField("Nombre de usuario", formData.username, User, "username")}
        {renderField("Correo electrónico", user?.primaryEmailAddress?.emailAddress || "-", Mail, "email", false, true)}
        {renderField("Número de teléfono", formData.phone, Phone, "phone")}
        {renderField("Habilidad/Ocupación", formData.occupation, Briefcase, "occupation")}
        {renderField("Biografía", formData.bio, FileText, "bio", true)}
      </div>
    </div>
  );
};

export default ProfileView;
