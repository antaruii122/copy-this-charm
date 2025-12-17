import coachPortrait from "@/assets/coach-portrait.jpg";

const AboutMe = () => {
  const stats = [
    { value: "+0.3k", label: "Clientes transformadas" },
    { value: "+79", label: "Programas completados" },
    { value: "+10", label: "Años de experiencia" },
  ];

  return (
    <section id="sobre-mi" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-square max-w-md mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-card">
              <img
                src={coachPortrait}
                alt="Coach de bienestar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
              Quien Soy
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Soy una apasionada del bienestar femenino y el equilibrio hormonal. Mi misión es 
              acompañarte en el camino de reconexión con tu cuerpo y tu ciclo natural.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Durante más de una década, he ayudado a cientos de mujeres a transformar su relación 
              con su cuerpo, dejando atrás los anticonceptivos hormonales y abrazando métodos 
              naturales que respetan su esencia femenina.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="font-serif text-3xl md:text-4xl text-primary font-semibold">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
