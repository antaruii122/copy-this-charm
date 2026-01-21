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

  return (
    <section id="sobre-mi" className="relative bg-white overflow-hidden">
      <div className="min-h-[700px] lg:grid lg:grid-cols-2">
        {/* Left Side: White Background + Portrait */}
        <div className="relative flex items-center justify-center p-12 lg:p-20 bg-white">
          <div className="relative w-full max-w-md">
            {/* Rectangular Portrait (3:4 Ratio) */}
            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <img
                alt="Coach de bienestar"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                src="/lovable-uploads/446de30f-261d-4a0d-853f-8d860dd2467e.webp"
              />
            </div>
            {/* Decorative element behind portrait */}
            <div className="absolute -bottom-10 -left-10 w-full h-full border-2 border-primary/20 rounded-3xl -z-0" />
            <div className="absolute top-10 right-10 w-32 h-32 bg-rose-100 rounded-full blur-3xl opacity-50 z-0" />
          </div>
        </div>

        {/* Right Side: Full Color Background + Content */}
        <div className="relative flex items-center justify-center p-12 lg:p-20">
          {/* Background Image */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${storyBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Minimal overlay just to ensure it's not too overwhelming, but keeping "full color" */}
            <div className="absolute inset-0 bg-black/5" />
          </div>

          {/* Content Card */}
          <div className="relative z-10 max-w-lg bg-white/85 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-white/50">
            <h2 className="font-serif text-4xl lg:text-5xl text-gray-900 mb-6">
              Mi Historia
            </h2>

            <div className="space-y-6">
              <p className="text-gray-800 text-lg leading-relaxed font-medium">
                Soy nutricionista especializada en salud hormonal femenina y fertilidad. Mi pasión es
                acompañar a mujeres a entender su cuerpo y su ciclo para alcanzar el bienestar que merecen.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Después de años de formación y experiencia clínica, creé NUTFEM para llegar a más mujeres
                con programas accesibles que combinan nutrición consciente, conocimiento del ciclo menstrual
                y un enfoque personalizado para cada etapa de la vida hormonal.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 mt-8 border-t border-gray-200">
              {stats.map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="font-serif text-3xl lg:text-4xl text-primary font-bold">
                    {stat.value}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600 font-medium mt-1 leading-tight">
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