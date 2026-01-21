import coachPortrait from "@/assets/coach-portrait.jpg";
import storyBg from "@/assets/mi_historia_bg.png";

const AboutMe = () => {
  const stats = [{
    value: "+500",
    label: "Mujeres acompañadas"
  }, {
    value: "+20",
    label: "Programas y cursos"
  }, {
    value: "+8",
    label: "Años de experiencia"
  }];
  return <section id="sobre-mi" className="py-20 md:py-32 relative overflow-hidden">
    {/* Background Image */}
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `url(${storyBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />

    {/* Contrast Overlay - Strong white/glass overlay for readability */}
    <div className="absolute inset-0 bg-white/90 z-0 backdrop-blur-[2px]" />

    <div className="container mx-auto px-4 relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="aspect-square max-w-md mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-card relative z-10">
            <img alt="Coach de bienestar" className="w-full h-full object-cover" src="/lovable-uploads/446de30f-261d-4a0d-853f-8d860dd2467e.webp" />
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl z-0" />
        </div>

        <div>
          <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-white/60">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
              Mi Historia
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Soy nutricionista especializada en salud hormonal femenina y fertilidad. Mi pasión es
              acompañar a mujeres a entender su cuerpo y su ciclo para alcanzar el bienestar que merecen.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Después de años de formación y experiencia clínica, creé NUTFEM para llegar a más mujeres
              con programas accesibles que combinan nutrición consciente, conocimiento del ciclo menstrual
              y un enfoque personalizado para cada etapa de la vida hormonal.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-primary/10">
              {stats.map(stat => <div key={stat.label} className="text-center lg:text-left">
                <div className="font-serif text-3xl md:text-4xl text-primary font-semibold">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>;
};
export default AboutMe;