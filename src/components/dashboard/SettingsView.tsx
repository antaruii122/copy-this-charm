import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Camera, Upload, Bold, Italic, Underline, Quote, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, Undo, Redo, Link } from "lucide-react";

const SettingsView = () => {
  const [formData, setFormData] = useState({
    nombre: "Ricardo",
    apellidos: "tapia",
    nombreUsuario: "papa",
    telefono: "",
    habilidad: "Diseñador de interfaces y experiencias de usuario",
    zonaHoraria: "Adak",
    biografia: "",
    nombrePublico: "Ricardo tapia",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-6">Ajustes</h1>
      
      <Tabs defaultValue="perfil" className="w-full">
        <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 mb-6">
          <TabsTrigger 
            value="perfil" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-sage data-[state=active]:bg-transparent data-[state=active]:text-sage px-4 py-2"
          >
            Perfil
          </TabsTrigger>
          <TabsTrigger 
            value="contrasena"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-sage data-[state=active]:bg-transparent data-[state=active]:text-sage px-4 py-2"
          >
            Contraseña
          </TabsTrigger>
          <TabsTrigger 
            value="social"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-sage data-[state=active]:bg-transparent data-[state=active]:text-sage px-4 py-2"
          >
            Perfiles sociales
          </TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="mt-0">
          {/* Cover Image */}
          <div className="relative mb-16">
            <div className="h-40 rounded-lg bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 relative overflow-hidden">
              {/* Geometric pattern overlay */}
              <div className="absolute inset-0 opacity-30">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <circle cx="20" cy="50" r="40" stroke="rgba(255,255,255,0.2)" fill="none" strokeWidth="0.5" />
                  <circle cx="80" cy="30" r="30" stroke="rgba(255,255,255,0.2)" fill="none" strokeWidth="0.5" />
                  <circle cx="60" cy="70" r="25" stroke="rgba(255,255,255,0.2)" fill="none" strokeWidth="0.5" />
                </svg>
              </div>
              
              {/* Trash icon */}
              <button className="absolute top-3 right-3 p-2 text-white/80 hover:text-white transition-colors">
                <Trash2 size={18} />
              </button>
              
              {/* Upload cover button */}
              <button className="absolute bottom-3 right-3 flex items-center gap-2 bg-foreground/80 hover:bg-foreground text-white px-3 py-1.5 rounded text-sm transition-colors">
                <Camera size={14} />
                Subir una foto de portada
              </button>
            </div>
            
            {/* Avatar */}
            <div className="absolute -bottom-12 left-6">
              <div className="w-24 h-24 rounded-full bg-muted border-4 border-background flex items-center justify-center relative">
                <div className="w-16 h-16 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 text-muted-foreground/50" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <button className="absolute bottom-0 right-0 p-1.5 bg-muted rounded-full border border-border">
                  <Camera size={12} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* Size hints */}
          <div className="flex gap-6 text-xs text-muted-foreground mb-6">
            <span>ⓘ Tamaño de la foto del perfil: <span className="text-sage">200x200</span> píxeles</span>
            <span>Tamaño de la foto de la portada: <span className="text-sage">700x430</span> píxeles</span>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Name row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input 
                  id="nombre" 
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input 
                  id="apellidos" 
                  value={formData.apellidos}
                  onChange={(e) => handleInputChange("apellidos", e.target.value)}
                />
              </div>
            </div>

            {/* Username row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombreUsuario">Nombre de usuario</Label>
                <Input 
                  id="nombreUsuario" 
                  value={formData.nombreUsuario}
                  onChange={(e) => handleInputChange("nombreUsuario", e.target.value)}
                  className="bg-sage/10 border-sage/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Número de teléfono</Label>
                <Input 
                  id="telefono" 
                  placeholder="Número de teléfono"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                />
              </div>
            </div>

            {/* Skill row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="habilidad">Habilidad/Ocupación</Label>
                <Input 
                  id="habilidad" 
                  value={formData.habilidad}
                  onChange={(e) => handleInputChange("habilidad", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zonaHoraria">Zona horaria</Label>
                <Select value={formData.zonaHoraria} onValueChange={(value) => handleInputChange("zonaHoraria", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Adak">Adak</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                    <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                    <SelectItem value="America/Mexico_City">America/Mexico_City</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-2">
              <Label htmlFor="biografia">Biografía</Label>
              <div className="border border-border rounded-lg overflow-hidden">
                {/* Rich text toolbar */}
                <div className="flex items-center gap-1 p-2 bg-muted/50 border-b border-border flex-wrap">
                  <button className="p-1.5 hover:bg-muted rounded"><Bold size={14} /></button>
                  <button className="p-1.5 hover:bg-muted rounded"><Italic size={14} /></button>
                  <button className="p-1.5 hover:bg-muted rounded"><Underline size={14} /></button>
                  <button className="p-1.5 hover:bg-muted rounded"><Quote size={14} /></button>
                  <div className="w-px h-4 bg-border mx-1" />
                  <button className="p-1.5 hover:bg-muted rounded"><List size={14} /></button>
                  <button className="p-1.5 hover:bg-muted rounded"><ListOrdered size={14} /></button>
                  <div className="w-px h-4 bg-border mx-1" />
                  <button className="p-1.5 hover:bg-muted rounded"><AlignLeft size={14} /></button>
                  <button className="p-1.5 hover:bg-muted rounded"><AlignCenter size={14} /></button>
                  <button className="p-1.5 hover:bg-muted rounded"><AlignRight size={14} /></button>
                  <button className="p-1.5 hover:bg-muted rounded"><AlignJustify size={14} /></button>
                  <div className="w-px h-4 bg-border mx-1" />
                  <button className="p-1.5 hover:bg-muted rounded"><Undo size={14} /></button>
                  <button className="p-1.5 hover:bg-muted rounded"><Redo size={14} /></button>
                  <button className="p-1.5 hover:bg-muted rounded"><Link size={14} /></button>
                </div>
                <Textarea 
                  id="biografia"
                  value={formData.biografia}
                  onChange={(e) => handleInputChange("biografia", e.target.value)}
                  className="border-0 rounded-none min-h-[120px] resize-y"
                  placeholder=""
                />
              </div>
            </div>

            {/* Public name */}
            <div className="space-y-2">
              <Label htmlFor="nombrePublico">Mostrar el nombre públicamente como</Label>
              <Select value={formData.nombrePublico} onValueChange={(value) => handleInputChange("nombrePublico", value)}>
                <SelectTrigger className="w-full md:w-80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ricardo tapia">Ricardo tapia</SelectItem>
                  <SelectItem value="Ricardo">Ricardo</SelectItem>
                  <SelectItem value="papa">papa</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                El nombre a mostrar se visualiza en todos los campos públicos, como el nombre del autor, el nombre del instructor, el nombre del estudiante y el nombre que se imprimirá en el certificado.
              </p>
            </div>

            {/* Submit button */}
            <Button variant="outline" className="border-sage text-sage hover:bg-sage hover:text-white">
              Actualizar el perfil
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="contrasena">
          <div className="space-y-6 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Contraseña actual</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
              <Input id="confirmPassword" type="password" />
            </div>
            <Button variant="outline" className="border-sage text-sage hover:bg-sage hover:text-white">
              Actualizar contraseña
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="social">
          <div className="space-y-6 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input id="facebook" placeholder="https://facebook.com/usuario" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input id="twitter" placeholder="https://twitter.com/usuario" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input id="linkedin" placeholder="https://linkedin.com/in/usuario" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input id="instagram" placeholder="https://instagram.com/usuario" />
            </div>
            <Button variant="outline" className="border-sage text-sage hover:bg-sage hover:text-white">
              Guardar perfiles sociales
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsView;
