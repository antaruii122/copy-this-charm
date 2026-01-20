import { useState, useEffect } from "react";
import { FileText, Download, FolderOpen, Search, Filter, Apple, Carrot, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  fileType: string;
  downloadUrl: string;
  courseRelated?: string;
}

// Placeholder resources - these will come from Supabase later
const placeholderResources: Resource[] = [
  {
    id: "1",
    title: "Guia de Alimentacion en el Ciclo Menstrual",
    description: "PDF completo con recomendaciones nutricionales para cada fase del ciclo",
    category: "Ciclo Menstrual",
    fileType: "PDF",
    downloadUrl: "#",
    courseRelated: "Masterclass: Nutrir tu Ciclo"
  },
  {
    id: "2",
    title: "Recetario de Fertilidad",
    description: "50 recetas optimizadas para apoyar tu fertilidad natural",
    category: "Fertilidad",
    fileType: "PDF",
    downloadUrl: "#",
    courseRelated: "Nutricion en Fertilidad Natural y Asistida"
  },
  {
    id: "3",
    title: "Plantilla de Seguimiento Hormonal",
    description: "Plantilla imprimible para registrar sintomas y alimentacion",
    category: "Herramientas",
    fileType: "PDF",
    downloadUrl: "#"
  },
  {
    id: "4",
    title: "Lista de Compras Menopausia",
    description: "Alimentos esenciales para transitar la menopausia con vitalidad",
    category: "Menopausia",
    fileType: "PDF",
    downloadUrl: "#",
    courseRelated: "MENO: 21 Dias de Transformacion"
  }
];

const categoryColors: Record<string, string> = {
  "Ciclo Menstrual": "bg-rose/10 text-rose-dark border-rose/30",
  "Fertilidad": "bg-sage-light/20 text-sage-dark border-sage/30",
  "Menopausia": "bg-terracotta/10 text-terracotta border-terracotta/30",
  "Herramientas": "bg-gold/10 text-gold border-gold/30"
};

const categoryIcons: Record<string, React.ElementType> = {
  "Ciclo Menstrual": Apple,
  "Fertilidad": Leaf,
  "Menopausia": Carrot,
  "Herramientas": FileText
};

const RecursosView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [resources] = useState<Resource[]>(placeholderResources);

  const categories = [...new Set(resources.map(r => r.category))];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-foreground mb-2">Recursos</h1>
        <p className="text-muted-foreground">Material descargable para complementar tu aprendizaje</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar recursos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/80"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={selectedCategory === null ? "bg-primary" : ""}
          >
            Todos
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-primary" : ""}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredResources.map((resource) => {
            const IconComponent = categoryIcons[resource.category] || FileText;

            return (
              <Card
                key={resource.id}
                className="bg-white/80 backdrop-blur-sm border-border/50 hover:shadow-card transition-all duration-300 hover:-translate-y-1 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${categoryColors[resource.category]?.split(' ')[0] || 'bg-primary/10'}`}>
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {resource.title}
                        </CardTitle>
                        <Badge variant="outline" className={`mt-1 text-xs ${categoryColors[resource.category] || ''}`}>
                          {resource.category}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {resource.fileType}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-sm">
                    {resource.description}
                  </CardDescription>

                  {resource.courseRelated && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Curso relacionado:</span> {resource.courseRelated}
                    </p>
                  )}

                  <Button
                    className="w-full bg-gradient-to-r from-primary to-sage-dark text-white hover:scale-[1.02] transition-transform"
                    disabled={resource.downloadUrl === "#"}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {resource.downloadUrl === "#" ? "Proximamente" : "Descargar"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-white/50 border-dashed">
          <CardContent className="py-16 text-center">
            <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron recursos</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedCategory
                ? "Intenta con otros terminos de busqueda o categoria"
                : "Aun no hay recursos disponibles"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Info Banner */}
      <Card className="bg-gradient-to-r from-sage-light/20 via-primary/5 to-rose/10 border-sage/30">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center flex-shrink-0">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Recursos exclusivos</h3>
              <p className="text-sm text-muted-foreground">
                Al completar cursos, desbloquearas recursos adicionales relacionados con cada programa
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecursosView;
