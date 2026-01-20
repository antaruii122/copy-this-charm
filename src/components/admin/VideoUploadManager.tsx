import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  Video,
  Trash2,
  ShieldX,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
  Plus,
  Edit,
  Save,
  X,
  Layers,
  GripVertical,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: string | null;
  is_featured: boolean;
}

interface CourseVideo {
  id: string;
  course_id: string;
  module_id: string | null;
  title: string;
  description: string | null;
  video_path: string;
  sort_order: number;
  duration_seconds: number | null;
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  sort_order: number;
}

interface UploadProgress {
  fileName: string;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

const VideoUploadManager = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<CourseVideo[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>("none");
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<CourseVideo | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const { toast } = useToast();

  const [newCourseForm, setNewCourseForm] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    is_featured: false,
  });

  const [videoMetadata, setVideoMetadata] = useState({
    title: "",
    description: "",
    course_id: "",
    module_id: "",
    sort_order: 0,
  });

  const [newModuleForm, setNewModuleForm] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    const syncAuth = async () => {
      const token = await getToken({ template: "supabase" });
      if (token) {
        await supabase.auth.setSession({
          access_token: token,
          refresh_token: "", // Not needed for Clerk session
        });
        checkAdminStatus();
      }
    };

    if (user) {
      syncAuth();
    }
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      fetchCourses();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (selectedCourse) {
      fetchCourseModules(selectedCourse);
      fetchCourseVideos(selectedCourse);
      setVideoMetadata(prev => ({ ...prev, course_id: selectedCourse }));
    }
  }, [selectedCourse]);

  const checkAdminStatus = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      setCheckingAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("admin_emails")
        .select("email")
        .eq("email", user.primaryEmailAddress.emailAddress)
        .maybeSingle();

      if (error) throw error;
      setIsAdmin(!!data);
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    } finally {
      setCheckingAdmin(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los cursos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseModules = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .eq("course_id", courseId)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setModules(data || []);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  const fetchCourseVideos = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from("course_videos")
        .select("*")
        .eq("course_id", courseId)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los videos",
        variant: "destructive",
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from("courses")
        .insert({
          title: newCourseForm.title,
          slug: newCourseForm.slug || generateSlug(newCourseForm.title),
          description: newCourseForm.description || null,
          price: newCourseForm.price || null,
          is_featured: newCourseForm.is_featured,
        })
        .select()
        .single();

      if (error) throw error;

      toast({ title: "Curso creado exitosamente" });
      setNewCourseForm({ title: "", slug: "", description: "", price: "", is_featured: false });
      setIsDialogOpen(false);
      fetchCourses();
      setSelectedCourse(data.id);
    } catch (error: any) {
      console.error("Error creating course:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el curso",
        variant: "destructive",
      });
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("modules")
        .insert({
          course_id: selectedCourse,
          title: newModuleForm.title,
          description: newModuleForm.description || null,
          sort_order: modules.length,
        });

      if (error) throw error;

      toast({ title: "Módulo creado exitosamente" });
      setNewModuleForm({ title: "", description: "" });
      setIsModuleDialogOpen(false);
      fetchCourseModules(selectedCourse);
    } catch (error: any) {
      console.error("Error creating module:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el módulo",
        variant: "destructive",
      });
    }
  };

  const handleUpdateModule = async (module: Module) => {
    try {
      const { error } = await supabase
        .from("modules")
        .update({
          title: module.title,
          description: module.description,
          sort_order: module.sort_order,
        })
        .eq("id", module.id);

      if (error) throw error;

      toast({ title: "Módulo actualizado exitosamente" });
      setEditingModule(null);
      fetchCourseModules(selectedCourse);
    } catch (error: any) {
      console.error("Error updating module:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el módulo",
        variant: "destructive",
      });
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm("¿Estás seguro? Los videos de este módulo dejarán de estar asociados a él (pero no se borrarán).")) return;
    try {
      const { error } = await supabase
        .from("modules")
        .delete()
        .eq("id", moduleId);

      if (error) throw error;

      toast({ title: "Módulo eliminado" });
      fetchCourseModules(selectedCourse);
      fetchCourseVideos(selectedCourse);
    } catch (error: any) {
      console.error("Error deleting module:", error);
    }
  };


  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!videoMetadata.course_id) {
      toast({
        title: "Error",
        description: "Por favor selecciona un curso primero",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const fileArray = Array.from(files);
    const progressArray: UploadProgress[] = fileArray.map((file) => ({
      fileName: file.name,
      progress: 0,
      status: "uploading",
    }));
    setUploadProgress(progressArray);

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      try {
        await uploadSingleFile(file, i);
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
      }
    }

    setIsUploading(false);
    fetchCourseVideos(videoMetadata.course_id);
    toast({ title: "Carga completada", description: "Todos los videos han sido procesados" });
  };

  const uploadSingleFile = async (file: File, index: number) => {
    const fileName = `${Date.now()}-${file.name}`;

    try {
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("videodecurso")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Update progress
      setUploadProgress((prev) =>
        prev.map((p, i) =>
          i === index ? { ...p, progress: 50, status: "uploading" } : p
        )
      );

      // Create video record in database
      const videoTitle = videoMetadata.title || file.name.replace(/\.[^/.]+$/, "");
      const { error: dbError } = await supabase
        .from("course_videos")
        .insert({
          course_id: videoMetadata.course_id,
          module_id: videoMetadata.module_id === "none" ? null : videoMetadata.module_id || null,
          title: videoTitle,
          description: videoMetadata.description || null,
          video_path: fileName,
          sort_order: videoMetadata.sort_order + index,
        });

      if (dbError) throw dbError;

      // Update progress to complete
      setUploadProgress((prev) =>
        prev.map((p, i) =>
          i === index ? { ...p, progress: 100, status: "success" } : p
        )
      );
    } catch (error: any) {
      setUploadProgress((prev) =>
        prev.map((p, i) =>
          i === index
            ? { ...p, status: "error", error: error.message }
            : p
        )
      );
      throw error;
    }
  };

  const handleDeleteVideo = async (videoId: string, videoPath: string) => {
    if (!confirm("¿Estás seguro de eliminar este video?")) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("videodecurso")
        .remove([videoPath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("course_videos")
        .delete()
        .eq("id", videoId);

      if (dbError) throw dbError;

      toast({ title: "Video eliminado exitosamente" });
      fetchCourseVideos(selectedCourse);
    } catch (error: any) {
      console.error("Error deleting video:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el video",
        variant: "destructive",
      });
    }
  };

  const handleUpdateVideo = async (video: CourseVideo) => {
    try {
      const { error } = await supabase
        .from("course_videos")
        .update({
          title: video.title,
          description: video.description,
          module_id: video.module_id === "none" ? null : video.module_id,
          sort_order: video.sort_order,
        })
        .eq("id", video.id);

      if (error) throw error;

      toast({ title: "Video actualizado exitosamente" });
      setEditingVideo(null);
      fetchCourseVideos(selectedCourse);
    } catch (error: any) {
      console.error("Error updating video:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el video",
        variant: "destructive",
      });
    }
  };

  if (checkingAdmin || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ShieldX size={48} className="text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Acceso Restringido
        </h2>
        <p className="text-muted-foreground max-w-md">
          No tienes permisos de administrador. Contacta al administrador si crees que deberías tener acceso.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <header className="relative py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-4">
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary text-[10px] font-bold tracking-widest uppercase">Admin Panel</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground tracking-tight">
              Constructor de <span className="text-primary italic">Aprendizaje</span>
            </h1>
            <p className="text-muted-foreground mt-4 text-lg max-w-2xl leading-relaxed">
              Diseña experiencias educativas de impacto. Administra módulos, organiza lecciones y gestiona tu contenido premium.
            </p>
          </div>
          <div className="flex gap-3">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 transition-all hover:scale-105">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Curso
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] border-none shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl">Nuevo Programa Educativo</DialogTitle>
                  <DialogDescription>Define la base de tu nuevo curso.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateCourse} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título del Curso</Label>
                    <Input
                      id="title"
                      value={newCourseForm.title}
                      onChange={(e) =>
                        setNewCourseForm({
                          ...newCourseForm,
                          title: e.target.value,
                          slug: generateSlug(e.target.value),
                        })
                      }
                      placeholder="Ej: MENO: 21 Días de Transformación"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL)</Label>
                    <Input
                      id="slug"
                      value={newCourseForm.slug}
                      onChange={(e) =>
                        setNewCourseForm({ ...newCourseForm, slug: e.target.value })
                      }
                      placeholder="meno-21-dias"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={newCourseForm.description}
                      onChange={(e) =>
                        setNewCourseForm({ ...newCourseForm, description: e.target.value })
                      }
                      placeholder="Descripción del curso..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio</Label>
                    <Input
                      id="price"
                      value={newCourseForm.price}
                      onChange={(e) =>
                        setNewCourseForm({ ...newCourseForm, price: e.target.value })
                      }
                      placeholder="$1,200"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                      Crear Curso
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {selectedCourse && (
              <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Layers size={16} />
                    Nuevo Módulo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Añadir Módulo al Curso</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateModule} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="module-title">Título del Módulo</Label>
                      <Input
                        id="module-title"
                        value={newModuleForm.title}
                        onChange={(e) =>
                          setNewModuleForm({ ...newModuleForm, title: e.target.value })
                        }
                        placeholder="Módulo 1: Introducción"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="module-description">Descripción (opcional)</Label>
                      <Textarea
                        id="module-description"
                        value={newModuleForm.description}
                        onChange={(e) =>
                          setNewModuleForm({ ...newModuleForm, description: e.target.value })
                        }
                        placeholder="Descripción breve..."
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1">
                        Crear Módulo
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsModuleDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </header>

      {/* Premium Course Selection Gallery */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-foreground/80">Programas Activos</h2>
          {selectedCourse && (
            <Button
              variant="ghost"
              onClick={() => setSelectedCourse("")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Ver todos los cursos
            </Button>
          )}
        </div>

        {!selectedCourse ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length === 0 ? (
              <Card className="col-span-full border-dashed p-12 flex flex-col items-center justify-center text-center bg-muted/5">
                <FolderOpen className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium">No hay cursos creados aún.</p>
                <Button variant="link" onClick={() => setIsDialogOpen(true)}>Crea tu primer curso ahora</Button>
              </Card>
            ) : (
              courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourse(course.id)}
                  className={cn(
                    "group relative p-6 rounded-3xl border bg-card/40 backdrop-blur-sm cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-1 hover:border-primary/30",
                    selectedCourse === course.id ? "border-primary ring-1 ring-primary/50" : "border-border/50"
                  )}
                >
                  <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronDown className="w-5 h-5 -rotate-90" />
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6">
                    <Video className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-2 line-clamp-1">{course.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-6">
                    {course.description || "Sin descripción proporcionada."}
                  </p>
                  <div className="flex items-center gap-4 pt-4 border-t border-border/30">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                      {course.price || "Gratis"}
                    </span>
                    {course.is_featured && (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full uppercase">
                        Destacado
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4 bg-primary/5 p-6 rounded-2xl border border-primary/10">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
              <Video className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-xl font-bold">{courses.find(c => c.id === selectedCourse)?.title}</h3>
              <p className="text-sm text-muted-foreground uppercase tracking-tighter">Editando Programa</p>
            </div>
          </div>
        )}
      </section>

      {selectedCourse && (
        <>
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Subir Videos
              </CardTitle>
              <CardDescription>
                Puedes seleccionar múltiples videos para subir a la vez
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="module-select">Módulo</Label>
                <Select
                  value={videoMetadata.module_id || "none"}
                  onValueChange={(val) => setVideoMetadata({ ...videoMetadata, module_id: val })}
                >
                  <SelectTrigger id="module-select">
                    <SelectValue placeholder="Selecciona un módulo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin Módulo</SelectItem>
                    {modules.map((mod) => (
                      <SelectItem key={mod.id} value={mod.id}>
                        {mod.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="video-title">Título del Video (opcional)</Label>
                <Input
                  id="video-title"
                  value={videoMetadata.title}
                  onChange={(e) =>
                    setVideoMetadata({ ...videoMetadata, title: e.target.value })
                  }
                  placeholder="Se usará el nombre del archivo si se deja vacío"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="video-description">Descripción (opcional)</Label>
                <Textarea
                  id="video-description"
                  value={videoMetadata.description}
                  onChange={(e) =>
                    setVideoMetadata({ ...videoMetadata, description: e.target.value })
                  }
                  placeholder="Descripción del video..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort-order">Orden inicial</Label>
                <Input
                  id="sort-order"
                  type="number"
                  value={videoMetadata.sort_order}
                  onChange={(e) =>
                    setVideoMetadata({
                      ...videoMetadata,
                      sort_order: parseInt(e.target.value) || 0,
                      course_id: selectedCourse,
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleFileSelect}
                  disabled={isUploading || !selectedCourse}
                  className="hidden"
                  id="video-upload"
                />
                <Label
                  htmlFor="video-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Video className="w-12 h-12 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {isUploading
                      ? "Subiendo videos..."
                      : "Click para seleccionar videos"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Soporta múltiples archivos MP4, MOV, AVI
                  </span>
                </Label>
              </div>

              {/* Upload Progress */}
              {uploadProgress.length > 0 && (
                <div className="space-y-2">
                  {uploadProgress.map((progress, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          {progress.status === "uploading" && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          )}
                          {progress.status === "success" && (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                          {progress.status === "error" && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          {progress.fileName}
                        </span>
                        <span>{progress.progress}%</span>
                      </div>
                      <Progress value={progress.progress} />
                      {progress.error && (
                        <p className="text-xs text-red-500">{progress.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Course Builder View */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Estructura del Curso
            </h3>

            {modules.length === 0 && videos.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Empezar a construir el curso creando un módulo o subiendo videos.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {modules.map((module) => {
                  const moduleVideos = videos.filter(v => v.module_id === module.id);
                  return (
                    <Card key={module.id} className="border-l-4 border-l-primary">
                      <CardHeader className="py-4 bg-muted/30">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            {editingModule?.id === module.id ? (
                              <div className="flex gap-2">
                                <Input
                                  value={editingModule.title}
                                  onChange={(e) => setEditingModule({ ...editingModule, title: e.target.value })}
                                  className="font-semibold"
                                />
                                <Button size="icon" onClick={() => handleUpdateModule(editingModule)}>
                                  <Save className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="outline" onClick={() => setEditingModule(null)}>
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <GripVertical className="text-muted-foreground w-4 h-4 cursor-grab" />
                                <CardTitle className="text-lg">{module.title}</CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => setEditingModule(module)}>
                                  <Edit className="w-3 h-3 text-muted-foreground" />
                                </Button>
                              </div>
                            )}
                            {module.description && !editingModule && (
                              <CardDescription>{module.description}</CardDescription>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteModule(module.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <VideoTable
                          videos={moduleVideos}
                          editingVideo={editingVideo}
                          setEditingVideo={setEditingVideo}
                          handleUpdateVideo={handleUpdateVideo}
                          handleDeleteVideo={handleDeleteVideo}
                          modules={modules}
                        />
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Unassigned Videos */}
                {videos.filter(v => !v.module_id).length > 0 && (
                  <Card className="border-l-4 border-l-muted">
                    <CardHeader className="py-4">
                      <CardTitle className="text-lg">Videos sin asignar</CardTitle>
                      <CardDescription>Videos que aún no pertenecen a ningún módulo</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <VideoTable
                        videos={videos.filter(v => !v.module_id)}
                        editingVideo={editingVideo}
                        setEditingVideo={setEditingVideo}
                        handleUpdateVideo={handleUpdateVideo}
                        handleDeleteVideo={handleDeleteVideo}
                        modules={modules}
                      />
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const VideoTable = ({
  videos,
  editingVideo,
  setEditingVideo,
  handleUpdateVideo,
  handleDeleteVideo,
  modules,
}: {
  videos: CourseVideo[];
  editingVideo: CourseVideo | null;
  setEditingVideo: (v: CourseVideo | null) => void;
  handleUpdateVideo: (v: CourseVideo) => void;
  handleDeleteVideo: (id: string, path: string) => void;
  modules: Module[];
}) => (
  <Table>
    <TableHeader>
      <TableRow className="bg-muted/30">
        <TableHead className="w-20">Orden</TableHead>
        <TableHead>Título</TableHead>
        <TableHead>Módulo</TableHead>
        <TableHead className="text-right">Acciones</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {videos.map((video) => (
        <TableRow key={video.id}>
          <TableCell>
            {editingVideo?.id === video.id ? (
              <Input
                type="number"
                value={editingVideo.sort_order}
                onChange={(e) =>
                  setEditingVideo({
                    ...editingVideo,
                    sort_order: parseInt(e.target.value) || 0,
                  })
                }
                className="w-16"
              />
            ) : (
              video.sort_order
            )}
          </TableCell>
          <TableCell>
            {editingVideo?.id === video.id ? (
              <Input
                value={editingVideo.title}
                onChange={(e) =>
                  setEditingVideo({
                    ...editingVideo,
                    title: e.target.value,
                  })
                }
              />
            ) : (
              video.title
            )}
          </TableCell>
          <TableCell>
            {editingVideo?.id === video.id ? (
              <Select
                value={editingVideo.module_id || "none"}
                onValueChange={(val) => setEditingVideo({ ...editingVideo, module_id: val })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Módulo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin Módulo</SelectItem>
                  {modules.map((mod) => (
                    <SelectItem key={mod.id} value={mod.id}>
                      {mod.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="text-xs text-muted-foreground">
                {modules.find(m => m.id === video.module_id)?.title || "-"}
              </span>
            )}
          </TableCell>
          <TableCell className="text-right">
            <div className="flex gap-2 justify-end">
              {editingVideo?.id === video.id ? (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUpdateVideo(editingVideo)}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingVideo(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingVideo(video)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleDeleteVideo(video.id, video.video_path)
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default VideoUploadManager;
