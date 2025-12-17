const ProfileView = () => {
  const profileData = [
    { label: "Fecha de registro", value: "diciembre 17, 2025 12:16 am" },
    { label: "Nombre", value: "Ricardo" },
    { label: "Apellidos", value: "tapia" },
    { label: "Nombre de usuario", value: "papa" },
    { label: "Correo electrónico", value: "rcgiroz@gmail.com" },
    { label: "Número de teléfono", value: "-" },
    { label: "Habilidad/Ocupación", value: "-" },
    { label: "Biografía", value: "-" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-8">Mi perfil</h1>
      
      <div className="space-y-4">
        {profileData.map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:gap-8">
            <span className="text-sage w-48 shrink-0 text-sm">{item.label}</span>
            <span className="text-foreground font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileView;
