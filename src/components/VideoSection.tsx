import { Play } from "lucide-react";

const VideoSection = () => {
  return (
    <section className="py-20 md:py-32 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-1 text-gold mb-4">
            {[...Array(5)].map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
          
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground mb-8 leading-relaxed">
            ¿Sabías que en la fase menstrual tu cuerpo necesita un extra de cuidado?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Cada fase de tu ciclo tiene necesidades nutricionales específicas. Aprende a escuchar tu cuerpo 
            y darle exactamente lo que necesita para sentirte llena de energía y equilibrada.
          </p>

          {/* Video Placeholder */}
          <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden shadow-card mb-8 group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
              </div>
            </div>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-foreground font-serif text-lg">
              Las etapas de tu ciclo vital y desde ahí...
            </p>
          </div>

          <a
            href="#contacto"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors text-lg"
          >
            ¡Saber más!
          </a>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
