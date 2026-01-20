import { useState, useEffect } from "react";
import { Award, Download, Lock, CheckCircle, BookOpen, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";

interface Certificate {
  id: string;
  courseTitle: string;
  courseSlug: string;
  completedDate: string | null;
  progress: number;
  isCompleted: boolean;
  totalLessons: number;
  completedLessons: number;
}

// Placeholder certificates - will be connected to real data
const placeholderCertificates: Certificate[] = [
  {
    id: "1",
    courseTitle: "Masterclass: Nutrir tu Ciclo",
    courseSlug: "masterclass-nutrir-ciclo",
    completedDate: "2024-12-15",
    progress: 100,
    isCompleted: true,
    totalLessons: 8,
    completedLessons: 8
  },
  {
    id: "2",
    courseTitle: "MENO: 21 Dias de Transformacion en Menopausia",
    courseSlug: "meno-21-dias",
    completedDate: null,
    progress: 45,
    isCompleted: false,
    totalLessons: 21,
    completedLessons: 9
  },
  {
    id: "3",
    courseTitle: "Nutricion en Fertilidad Natural y Asistida",
    courseSlug: "nutricion-fertilidad",
    completedDate: null,
    progress: 0,
    isCompleted: false,
    totalLessons: 15,
    completedLessons: 0
  }
];

const CertificadosView = () => {
  const { user } = useUser();
  const [certificates, setCertificates] = useState<Certificate[]>(placeholderCertificates);

  const completedCertificates = certificates.filter(c => c.isCompleted);
  const inProgressCertificates = certificates.filter(c => !c.isCompleted && c.progress > 0);
  const notStartedCertificates = certificates.filter(c => c.progress === 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-foreground mb-2">Certificados</h1>
        <p className="text-muted-foreground">Tus logros y certificaciones de cursos completados</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500 flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-green-700">{completedCertificates.length}</p>
            <p className="text-sm text-green-600">Certificados obtenidos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-sage-light/10 border-primary/20">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-primary">{inProgressCertificates.length}</p>
            <p className="text-sm text-muted-foreground">Cursos en progreso</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-muted/30 to-muted/10 border-border/50">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
              <Lock className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold text-muted-foreground">{notStartedCertificates.length}</p>
            <p className="text-sm text-muted-foreground">Por comenzar</p>
          </CardContent>
        </Card>
      </div>

      {/* Completed Certificates */}
      {completedCertificates.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-semibold text-foreground flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Certificados Obtenidos
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {completedCertificates.map((cert) => (
              <Card
                key={cert.id}
                className="bg-gradient-to-br from-green-50/80 to-white border-green-200/50 hover:shadow-card transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                        <Award className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{cert.courseTitle}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-600">
                            Completado el {cert.completedDate && formatDate(cert.completedDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {cert.totalLessons} lecciones completadas
                    </Badge>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* In Progress */}
      {inProgressCertificates.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            En Progreso
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {inProgressCertificates.map((cert) => (
              <Card
                key={cert.id}
                className="bg-white/80 backdrop-blur-sm border-border/50 hover:shadow-card transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-sage-light/20 flex items-center justify-center border border-primary/30">
                      <Award className="w-7 h-7 text-primary/50" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{cert.courseTitle}</CardTitle>
                      <CardDescription className="mt-1">
                        {cert.completedLessons} de {cert.totalLessons} lecciones
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium text-primary">{cert.progress}%</span>
                    </div>
                    <Progress value={cert.progress} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-primary border-primary/30">
                      <Lock className="w-3 h-3 mr-1" />
                      Certificado bloqueado
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      Continuar curso
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Not Started */}
      {notStartedCertificates.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-semibold text-muted-foreground flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Por Comenzar
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {notStartedCertificates.map((cert) => (
              <Card
                key={cert.id}
                className="bg-muted/20 border-border/30 opacity-75 hover:opacity-100 transition-opacity"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <Award className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-muted-foreground">{cert.courseTitle}</h3>
                      <p className="text-xs text-muted-foreground/70">{cert.totalLessons} lecciones</p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-primary">
                      Comenzar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {certificates.length === 0 && (
        <Card className="bg-white/50 border-dashed">
          <CardContent className="py-16 text-center">
            <Award className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Aun no tienes certificados</h3>
            <p className="text-muted-foreground mb-6">
              Completa tus cursos para obtener certificados de finalizacion
            </p>
            <Button className="bg-primary">
              <BookOpen className="w-4 h-4 mr-2" />
              Explorar cursos
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CertificadosView;
