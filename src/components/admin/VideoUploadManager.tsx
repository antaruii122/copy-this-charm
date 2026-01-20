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
  Layout,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Settings,
  Users,
  ClipboardList,
  PieChart,
  UserPlus,
  ShieldCheck,
  ChevronRight
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  long_description: string | null;
  learning_outcomes: any;
  target_audience: string | null;
  curriculum_summary: string | null;
  author_name: string | null;
  author_image_url: string | null;
  author_role: string | null;
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
  const [adminEmails, setAdminEmails] = useState<{ id: string; email: string }[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const { toast } = useToast();

  const [newCourseForm, setNewCourseForm] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    is_featured: false,
    long_description: "",
    learning_outcomes: [] as string[],
    target_audience: "",
    curriculum_summary: "",
    author_name: "",
    author_role: "",
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

  const selectedCourseData = courses.find(c => c.id === selectedCourse);

  const updateCourseMarketing = (updates: Partial<Course>) => {
    setCourses(prev => prev.map(c =>
      c.id === selectedCourse ? { ...c, ...updates } : c
    ));
  };

  const handleSaveMarketing = async () => {
    if (!selectedCourseData) return;
    try {
      const { error } = await supabase
        .from("courses")
        .update({
          long_description: selectedCourseData.long_description,
          target_audience: selectedCourseData.target_audience,
          author_name: selectedCourseData.author_name,
          author_role: selectedCourseData.author_role,
          author_image_url: selectedCourseData.author_image_url,
        })
        .eq("id", selectedCourse);

      if (error) throw error;
      toast({ title: "Cambios guardados", description: "La información de marketing ha sido actualizada." });
    } catch (error: any) {
      toast({ title: "Error al guardar", description: error.message, variant: "destructive" });
    }
  };

  useEffect(() => {
    const syncAuth = async () => {
      const token = await getToken({ template: "supabase" });
      if (token) {
        // Diagnostic: Help user see what's inside their token
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log("Supabase JWT Claims:", payload);
          if (!payload.email) {
            console.error("CRITICAL: JWT is missing 'email' claim. Check Clerk Supabase template!");
          }
        } catch (e) {
          console.error("Error decoding JWT:", e);
        }

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
      fetchAdminEmails();
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
      setCheckingAdmin(true);
      const email = user.primaryEmailAddress.emailAddress.toLowerCase().trim();

      const { data, error } = await supabase
        .from("admin_emails")
        .select("email")
        .eq("email", email)
        .maybeSingle();

      if (error) throw error;
      setIsAdmin(!!data);

      if (!data) {
        console.warn(`Access denied for ${email}. Not found in admin_emails table.`);
      }
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
      setCourses((data as any) || []);
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

  const fetchAdminEmails = async () => {
    try {
      const { data, error } = await supabase
        .from("admin_emails")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setAdminEmails(data || []);
    } catch (error) {
      console.error("Error fetching admin emails:", error);
    }
  };

  const handleAddAdminEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;

    try {
      const { error } = await supabase
        .from("admin_emails")
        .insert({ email: newAdminEmail.toLowerCase().trim() });

      if (error) throw error;

      toast({ title: "Administrador añadido exitosamente" });
      setNewAdminEmail("");
      fetchAdminEmails();
    } catch (error: any) {
      console.error("Error adding admin email:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo añadir el administrador",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAdminEmail = async (id: string, email: string) => {
    if (email === user?.primaryEmailAddress?.emailAddress) {
      toast({
        title: "Acción no permitida",
        description: "No puedes eliminarte a ti mismo como administrador",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar a ${email} como administrador?`)) return;

    try {
      const { error } = await supabase
        .from("admin_emails")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Administrador eliminado" });
      fetchAdminEmails();
    } catch (error: any) {
      console.error("Error deleting admin email:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el administrador",
        variant: "destructive",
      });
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
      setNewCourseForm({
        title: "",
        slug: "",
        description: "",
        price: "",
        is_featured: false,
        long_description: "",
        learning_outcomes: [],
        target_audience: "",
        curriculum_summary: "",
        author_name: "",
        author_role: "",
      });
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
    // Sanitize file name: remove special characters, spaces, and accents
    const sanitizedName = file.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-zA-Z0-9.-]/g, "_") // Replace everything else with underscore
      .replace(/_{2,}/g, "_"); // Remove consecutive underscores

    const fileName = `${Date.now()}-${sanitizedName}`;

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
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary text-[10px] font-bold tracking-widest uppercase">Sistema de Gestión Premium</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground tracking-tight uppercase">
              Administración de <span className="text-black italic underline decoration-gold underline-offset-8">Cursos</span>
            </h1>
            <p className="text-muted-foreground mt-4 text-lg max-w-2xl leading-relaxed">
              Gestiona el contenido de tus cursos, organiza módulos y administra los permisos de acceso de tu equipo.
            </p>
          </div>
        </div>
      </header>

      <Tabs defaultValue="cursos" className="space-y-8">
        <TabsList className="bg-muted/50 p-1 rounded-2xl border border-border/50 backdrop-blur-sm">
          <TabsTrigger value="cursos" className="rounded-xl gap-2 px-6 data-[state=active]:bg-black data-[state=active]:text-white">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gold text-black text-[10px] font-bold mr-1">1</span>
            Elegir Programa
          </TabsTrigger>
          <TabsTrigger value="contenido" className="rounded-xl gap-2 px-6 data-[state=active]:bg-black data-[state=active]:text-white" disabled={!selectedCourse}>
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gold text-black text-[10px] font-bold mr-1">2</span>
            Añadir Contenido
          </TabsTrigger>
          <TabsTrigger value="admins" className="rounded-xl gap-2 px-6 data-[state=active]:bg-black data-[state=active]:text-white">
            <Users className="w-4 h-4" />
            Accesos
          </TabsTrigger>
          <TabsTrigger value="marketing" className="rounded-xl gap-2 px-6 data-[state=active]:bg-black data-[state=active]:text-white" disabled={!selectedCourse}>
            <Layout className="w-4 h-4" />
            Marketing
          </TabsTrigger>
          <TabsTrigger value="ajustes" className="rounded-xl gap-2 px-6 data-[state=active]:bg-black data-[state=active]:text-white">
            <Settings className="w-4 h-4" />
            Configuración
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cursos" className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="font-serif text-2xl text-foreground/80">Programas Activos</h2>
              <p className="text-sm text-muted-foreground">Selecciona un curso para gestionar su contenido</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full px-6 shadow-md transition-all hover:scale-105 gap-2">
                  <Plus className="w-4 h-4" />
                  Nuevo Curso
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] border-none shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl">Nuevo Programa Educativo</DialogTitle>
                  <DialogDescription>Define la base de tu nuevo curso.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateCourse} className="space-y-4 pt-4">
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
                  <div className="flex gap-3 pt-6">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length === 0 ? (
              <Card className="col-span-full border-dashed p-12 flex flex-col items-center justify-center text-center bg-muted/5 rounded-3xl">
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
                    "group relative p-6 rounded-3xl border bg-white cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1",
                    selectedCourse === course.id
                      ? "border-black border-2 shadow-[0_0_20px_rgba(0,0,0,0.1)] bg-neutral-50 scale-[1.02]"
                      : "border-neutral-100 hover:border-black/20"
                  )}
                >
                  <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6">
                    <Video className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-2 line-clamp-1">{course.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-6">
                    {course.description || "Sin descripción proporcionada."}
                  </p>
                  <div className="flex items-center gap-4 pt-4 border-t border-border/30">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-primary/70">
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
        </TabsContent>

        <TabsContent value="contenido" className="space-y-10 animate-in fade-in duration-500">
          {!selectedCourse ? (
            <Card className="rounded-3xl border-dashed p-20 flex flex-col items-center justify-center text-center">
              <Layout className="w-12 h-12 text-muted-foreground/20 mb-4" />
              <h3 className="text-xl font-medium mb-2">Ningún curso seleccionado</h3>
              <p className="text-muted-foreground mb-6">Selecciona un curso en la pestaña "Cursos" para gestionar su contenido.</p>
            </Card>
          ) : (
            <>
              {/* Course Header Info */}
              <div className="flex items-center gap-6 bg-card/50 backdrop-blur-sm p-6 rounded-3xl border border-border/50">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20">
                  <Video className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Gestión de Contenido</span>
                  <h3 className="font-serif text-3xl font-bold mt-1 text-foreground">
                    {courses.find(c => c.id === selectedCourse)?.title}
                  </h3>
                </div>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setIsModuleDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Módulo
                </Button>
              </div>

              {/* Upload Section */}
              <Card className="rounded-3xl overflow-hidden border-none shadow-sm bg-card/30 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl font-serif">
                    <Upload className="w-5 h-5 text-black" />
                    Paso 2: Subir y Organizar Lecciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="module-select" className="text-sm font-medium ml-1">Módulo de destino</Label>
                      <Select
                        value={videoMetadata.module_id || "none"}
                        onValueChange={(val) => setVideoMetadata({ ...videoMetadata, module_id: val })}
                      >
                        <SelectTrigger id="module-select" className="rounded-xl h-12 bg-background/50">
                          <SelectValue placeholder="Selecciona un módulo" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="none">Sin Módulo (General)</SelectItem>
                          {modules.map((mod) => (
                            <SelectItem key={mod.id} value={mod.id}>
                              {mod.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="video-title" className="text-sm font-medium ml-1">Título (Opcional)</Label>
                      <Input
                        id="video-title"
                        value={videoMetadata.title}
                        onChange={(e) =>
                          setVideoMetadata({ ...videoMetadata, title: e.target.value })
                        }
                        className="rounded-xl h-12 bg-background/50"
                        placeholder="Nombre de la lección"
                      />
                    </div>
                  </div>

                  <div className="group relative border-2 border-dashed border-primary/20 hover:border-primary/40 rounded-2xl p-10 text-center transition-all bg-primary/5">
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
                      className="cursor-pointer flex flex-col items-center gap-3"
                    >
                      <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-base font-semibold block">
                          {isUploading ? "Subiendo contenido..." : "Sube tus videos educativos"}
                        </span>
                        <span className="text-xs text-muted-foreground block">
                          Selecciona uno o varios archivos (MP4, MOV, etc.)
                        </span>
                      </div>
                    </Label>
                  </div>

                  {uploadProgress.length > 0 && (
                    <div className="space-y-4 pt-2">
                      {uploadProgress.map((progress, index) => (
                        <div key={index} className="bg-background/40 p-4 rounded-xl border border-border/50">
                          <div className="flex items-center justify-between text-sm mb-2 font-medium">
                            <span className="flex items-center gap-2 truncate">
                              {progress.status === "uploading" && <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />}
                              {progress.status === "success" && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                              {progress.status === "error" && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                              {progress.fileName}
                            </span>
                            <span className="text-xs text-muted-foreground">{progress.progress}%</span>
                          </div>
                          <Progress value={progress.progress} className="h-1.5" />
                          {progress.error && (
                            <p className="text-xs text-red-500 mt-2 font-medium">{progress.error}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Course Builder Structure */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-serif font-semibold text-foreground/80 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-primary" />
                    Estructura Curricular
                  </h3>
                </div>

                {modules.length === 0 && videos.length === 0 ? (
                  <Card className="rounded-3xl border-dashed p-16 text-center bg-muted/5">
                    <p className="text-muted-foreground">Empezar a construir el curso creando un módulo o subiendo videos.</p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {modules.map((module) => {
                      const moduleVideos = videos.filter(v => v.module_id === module.id);
                      return (
                        <Card key={module.id} className="rounded-3xl overflow-hidden border border-border/50 transition-all hover:border-primary/20">
                          <CardHeader className="py-5 bg-muted/20">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                {editingModule?.id === module.id ? (
                                  <div className="flex gap-2 max-w-md">
                                    <Input
                                      value={editingModule.title}
                                      onChange={(e) => setEditingModule({ ...editingModule, title: e.target.value })}
                                      className="rounded-xl font-medium"
                                    />
                                    <Button size="icon" className="shrink-0 rounded-xl" onClick={() => handleUpdateModule(editingModule)}>
                                      <Save className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="outline" className="shrink-0 rounded-xl" onClick={() => setEditingModule(null)}>
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-muted-foreground border border-border/50">
                                      <GripVertical size={14} />
                                    </div>
                                    <CardTitle className="text-lg font-serif">{module.title}</CardTitle>
                                    <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 text-muted-foreground" onClick={() => setEditingModule(module)}>
                                      <Edit size={14} />
                                    </Button>
                                  </div>
                                )}
                                {module.description && !editingModule && (
                                  <CardDescription className="ml-11 mt-1">{module.description}</CardDescription>
                                )}
                              </div>
                              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/5" onClick={() => handleDeleteModule(module.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="p-0 border-t border-border/50 bg-background/20">
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

                    {videos.filter(v => !v.module_id).length > 0 && (
                      <Card className="rounded-3xl overflow-hidden border border-dashed border-border/50 bg-background/5 mt-8">
                        <CardHeader className="py-5">
                          <CardTitle className="text-lg font-medium opacity-70 italic">Videos sin asignar</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 border-t border-border/50">
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
                  </div>
                )}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="admins" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="font-serif text-3xl font-semibold text-foreground">Control de Accesos</h2>
              <p className="text-muted-foreground">Gestiona quién tiene autorización para editar contenido en la plataforma.</p>
            </div>

            <Card className="rounded-3xl border-none shadow-xl bg-card/50 backdrop-blur-md overflow-hidden">
              <CardHeader className="bg-primary/5 pb-8 pt-10 px-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
                  <UserPlus className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl font-serif">Añadir Administrador</CardTitle>
                <CardDescription>
                  El nuevo administrador podrá crear cursos, subir videos y gestionar otros accesos.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-10">
                <form onSubmit={handleAddAdminEmail} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="rounded-2xl h-14 pl-6 text-lg bg-background/80"
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="rounded-2xl h-14 px-10 font-bold transition-all hover:shadow-lg">
                    Otorgar Acceso
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-serif text-xl font-medium">Equipo Autorizado</h3>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{adminEmails.length} Miembros</span>
              </div>

              <div className="grid gap-3">
                {adminEmails.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between p-5 bg-card/40 backdrop-blur-sm rounded-2xl border border-border/50 group hover:border-primary/20 transition-all hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary font-bold text-lg">
                        {admin.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{admin.email}</p>
                        {admin.email === user?.primaryEmailAddress?.emailAddress && (
                          <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full uppercase">Tú (Propietario)</span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/5 opacity-0 group-hover:opacity-100 transition-all"
                      onClick={() => handleDeleteAdminEmail(admin.id, admin.email)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ajustes" className="animate-in fade-in duration-500">
          <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto">
              <Settings className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-serif font-semibold">Configuración General</h2>
            <p className="text-muted-foreground">Próximamente: Podrás configurar colores de marca, integraciones de pago y personalización avanzada de la plataforma.</p>
            <Button variant="outline" className="rounded-2xl" disabled>Configurar Marca</Button>
          </div>
        </TabsContent>
        <TabsContent value="marketing" className="space-y-8">
          {selectedCourseData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="rounded-3xl border-none shadow-xl bg-white p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-bold">Página de Ventas</h3>
                  <p className="text-sm text-muted-foreground">Configura el contenido público que verán los interesados.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Descripción Larga (Markdown)</Label>
                    <Textarea
                      placeholder="Describe el curso en detalle..."
                      className="min-h-[200px]"
                      value={selectedCourseData.long_description || ""}
                      onChange={(e) => updateCourseMarketing({ long_description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>¿A quién va dirigido?</Label>
                    <Textarea
                      placeholder="Ej: Mujeres que buscan equilibrio hormonal..."
                      value={selectedCourseData.target_audience || ""}
                      onChange={(e) => updateCourseMarketing({ target_audience: e.target.value })}
                    />
                  </div>
                </div>
              </Card>

              <Card className="rounded-3xl border-none shadow-xl bg-white p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-bold">Autor & Diseño</h3>
                  <p className="text-sm text-muted-foreground">Define quién imparte el programa.</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre del Autor</Label>
                      <Input
                        placeholder="Nombre..."
                        value={selectedCourseData.author_name || ""}
                        onChange={(e) => updateCourseMarketing({ author_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rol/Título</Label>
                      <Input
                        placeholder="Ej: Nutricionista Humana..."
                        value={selectedCourseData.author_role || ""}
                        onChange={(e) => updateCourseMarketing({ author_role: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>URL Imagen Autor</Label>
                    <Input
                      placeholder="https://..."
                      value={selectedCourseData.author_image_url || ""}
                      onChange={(e) => updateCourseMarketing({ author_image_url: e.target.value })}
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      className="w-full bg-black text-white rounded-full hover:bg-neutral-800"
                      onClick={() => handleSaveMarketing()}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Guardar Cambios de Marketing
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog for Module Creation (Shared across tabs if needed) */}
      <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
        <DialogContent className="rounded-3xl border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Gestionar Estructura</DialogTitle>
            <DialogDescription>Añade un nuevo módulo a tu programa curricular.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateModule} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="module-title-dialog">Título del Módulo</Label>
              <Input
                id="module-title-dialog"
                value={newModuleForm.title}
                onChange={(e) =>
                  setNewModuleForm({ ...newModuleForm, title: e.target.value })
                }
                placeholder="Ej: Fundamentos del Mindfulness"
                required
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="module-description-dialog">Descripción</Label>
              <Textarea
                id="module-description-dialog"
                value={newModuleForm.description}
                onChange={(e) =>
                  setNewModuleForm({ ...newModuleForm, description: e.target.value })
                }
                placeholder="Breve resumen de lo que aprenderán en este bloque..."
                rows={3}
                className="rounded-xl"
              />
            </div>
            <div className="flex gap-3 pt-6">
              <Button type="submit" className="flex-1 rounded-xl">Crear Módulo</Button>
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsModuleDialogOpen(false)}>Cancelar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
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
        <TableHead className="w-40">Vista Previa</TableHead>
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
            <div className="w-32 h-20 bg-neutral-900 rounded-xl overflow-hidden shadow-inner flex items-center justify-center border border-black/10 group/preview relative">
              <video
                src={`https://baijfzqjgvgbfzuauroi.supabase.co/storage/v1/object/public/videodecurso/${video.video_path}`}
                className="w-full h-full object-cover opacity-60 group-hover/preview:opacity-100 transition-opacity"
                muted
                playsInline
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity pointer-events-none">
                  <Video className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
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
