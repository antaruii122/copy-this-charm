import { Calendar, Clock, Video, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AgendaView = () => {
  // Placeholder for Cal.com integration
  // When you have your Cal.com account ready, replace CAL_COM_USERNAME with your username
  const calComUsername = "YOUR_USERNAME"; // TODO: Replace with actual Cal.com username
  const calComLink = `https://cal.com/${calComUsername}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-foreground mb-2">Agenda</h1>
        <p className="text-muted-foreground">Reserva una cita o consulta conmigo</p>
      </div>

      {/* Main Booking Card */}
      <Card className="bg-gradient-to-br from-primary/5 via-sage-light/5 to-rose/5 border-primary/20">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-sage-dark flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="font-serif text-2xl">Reservar Consulta</CardTitle>
          <CardDescription className="text-base">
            Agenda una sesion personalizada para resolver tus dudas sobre nutricion hormonal
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {/* Placeholder message - remove when Cal.com is configured */}
          <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 text-sm text-gold">
            <p className="font-medium">Proximamente disponible</p>
            <p className="text-gold/80 mt-1">La integracion con Cal.com esta en proceso de configuracion</p>
          </div>

          {/* Cal.com embed placeholder */}
          <div className="bg-white/50 rounded-2xl p-8 border border-border/50 min-h-[300px] flex flex-col items-center justify-center">
            <Video className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-center max-w-md">
              Aqui aparecera el calendario de reservas cuando este configurado Cal.com
            </p>

            {/* Uncomment this when Cal.com is ready:
            <iframe
              src={`https://cal.com/${calComUsername}?embed=true`}
              className="w-full h-[500px] border-0 rounded-xl"
              title="Reservar cita"
            />
            */}
          </div>

          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-sage-dark text-white hover:scale-105 transition-transform"
            onClick={() => window.open(calComLink, '_blank')}
            disabled={calComUsername === "YOUR_USERNAME"}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Abrir Calendario Completo
          </Button>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-border/50">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-rose/20 to-primary/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Duracion</h3>
            <p className="text-sm text-muted-foreground">Sesiones de 30 a 60 minutos segun tus necesidades</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-border/50">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-sage-light/20 to-terracotta/20 flex items-center justify-center">
              <Video className="w-6 h-6 text-sage-dark" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Modalidad</h3>
            <p className="text-sm text-muted-foreground">Consultas online via Zoom o Google Meet</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-border/50">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-gold/20 to-terracotta/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Disponibilidad</h3>
            <p className="text-sm text-muted-foreground">Horarios flexibles adaptados a tu zona horaria</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgendaView;
