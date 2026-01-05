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

          {/* Embedded YouTube Video */}
          <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden shadow-card mb-8">
            <iframe
              src="https://www.youtube-nocookie.com/embed/WaNQf30vyXk"
              title="Las etapas de tu ciclo vital - Alimenta tu Fertilidad"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              loading="lazy"
            />
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
