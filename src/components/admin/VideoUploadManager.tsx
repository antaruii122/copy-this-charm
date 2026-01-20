import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  Video,
  Trash2,
  ShieldX,
  Loader2,
  Plus,
  Save,
  Layout,
  ChevronRight,
  ShieldCheck,
  Play
} from "lucide-react";
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

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
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
  video_path: string;
  sort_order: number;
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  sort_order: number;
}

const VideoUploadManager = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { toast } = useToast();

  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<CourseVideo[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);

  const [newCourseForm, setNewCourseForm] = useState({
    title: "",
    slug: "",
    description: "",
    image_url: "",
  });

  const [newModuleForm, setNewModuleForm] = useState({
    title: "",
  });

  const selectedCourseData = courses.find(c => c.id === selectedCourse);

  const updateCourseMarketing = (updates: Partial<Course>) => {
    setCourses(prev => prev.map(c =>
      c.id === selectedCourse ? { ...c, ...updates } : c
    ));
  };

  useEffect(() => {
    const init = async () => {
      const token = await getToken({ template: "supabase" });
      if (token) {
        await supabase.auth.setSession({ access_token: token, refresh_token: "" });
        checkAdminStatus();
      }
    };
    if (user) init();
  }, [user]);

  useEffect(() => {
    if (isAdmin) fetchCourses();
  }, [isAdmin]);

  useEffect(() => {
    if (selectedCourse) {
      fetchCourseModules(selectedCourse);
      fetchCourseVideos(selectedCourse);
    }
  }, [selectedCourse]);

  const checkAdminStatus = async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase().trim();
      if (!email) return;
      const { data } = await supabase.from("admin_emails").select("email").eq("email", email).maybeSingle();
      setIsAdmin(!!data);
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingAdmin(false);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
    setCourses(data as any || []);
    setLoading(false);
  };

  const fetchCourseModules = async (courseId: string) => {
    const { data } = await supabase.from("modules").select("*").eq("course_id", courseId).order("sort_order");
    setModules(data || []);
  };

  const fetchCourseVideos = async (courseId: string) => {
    const { data } = await supabase.from("course_videos").select("*").eq("course_id", courseId).order("sort_order");
    setVideos(data || []);
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from("courses").insert({
        title: newCourseForm.title,
        slug: newCourseForm.slug || newCourseForm.title.toLowerCase().replace(/ /g, "-"),
        image_url: newCourseForm.image_url,
      }).select().single();

      if (error) throw error;
      toast({ title: "Curso creado" });
      setIsDialogOpen(false);
      fetchCourses();
      setSelectedCourse(data.id);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleSaveMarketing = async () => {
    if (!selectedCourseData) return;
    try {
      const { error } = await supabase.from("courses").update({
        long_description: selectedCourseData.long_description,
        target_audience: selectedCourseData.target_audience,
        author_name: selectedCourseData.author_name,
        author_role: selectedCourseData.author_role,
        author_image_url: selectedCourseData.author_image_url,
        image_url: selectedCourseData.image_url,
      }).eq("id", selectedCourse);

      if (error) throw error;
      toast({ title: "Cambios guardados" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("modules").insert({
      course_id: selectedCourse,
      title: newModuleForm.title,
      sort_order: modules.length,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Módulo creado" });
      setIsModuleDialogOpen(false);
      fetchCourseModules(selectedCourse);
    }
  };

  if (checkingAdmin || (isAdmin && loading)) return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  if (!isAdmin) return <div className="p-20 text-center"><ShieldX className="w-12 h-12 mx-auto mb-4 text-neutral-300" /><h2>Acceso restringido</h2></div>;

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto px-6">
      <header className="py-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 border border-primary/10 rounded-full mb-6">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span className="text-primary text-[10px] font-bold tracking-widest uppercase italic">Admin Panel</span>
        </div>
        <h1 className="font-serif text-5xl font-light text-neutral-900 uppercase tracking-tight">Academia <span className="text-primary italic">Ayurveda</span></h1>
      </header>

      <Tabs defaultValue="cursos" className="space-y-12">
        <TabsList className="bg-neutral-100/50 p-1.5 rounded-[2rem] border border-neutral-200/50 shadow-sm inline-flex h-16">
          <TabsTrigger value="cursos" className="rounded-[1.5rem] px-10 data-[state=active]:bg-white data-[state=active]:shadow-md font-bold uppercase text-[10px] tracking-[0.2em] transition-all">Programas</TabsTrigger>
          <TabsTrigger value="contenido" className="rounded-[1.5rem] px-10 data-[state=active]:bg-white data-[state=active]:shadow-md font-bold uppercase text-[10px] tracking-[0.2em] transition-all" disabled={!selectedCourse}>Contenido</TabsTrigger>
          <TabsTrigger value="marketing" className="rounded-[1.5rem] px-10 data-[state=active]:bg-white data-[state=active]:shadow-md font-bold uppercase text-[10px] tracking-[0.2em] transition-all" disabled={!selectedCourse}>Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value="cursos" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-3xl font-light text-neutral-800 uppercase tracking-widest">Oferta Educativa</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full px-10 py-7 bg-primary text-white hover:bg-primary/90 shadow-xl gap-2 transition-transform hover:scale-105">
                  <Plus className="w-5 h-5" /> Nuevo Curso
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[3rem] p-12 max-w-xl border-none shadow-2xl bg-white">
                <DialogHeader className="mb-10">
                  <DialogTitle className="font-serif text-3xl font-light uppercase tracking-widest">Crear Programa</DialogTitle>
                  <DialogDescription className="text-neutral-400 mt-2">Define la identidad basica de tu nuevo curso.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateCourse} className="space-y-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 ml-1">Título del Curso</Label>
                    <Input value={newCourseForm.title} onChange={e => setNewCourseForm({ ...newCourseForm, title: e.target.value })} className="rounded-2xl border-neutral-100 bg-[#FAF9F6] h-14 px-6 focus:ring-1 focus:ring-primary" placeholder="Ej: Nutrición Consciente" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 ml-1">Miniatura de Portada (URL)</Label>
                    <Input value={newCourseForm.image_url} onChange={e => setNewCourseForm({ ...newCourseForm, image_url: e.target.value })} className="rounded-2xl border-neutral-100 bg-[#FAF9F6] h-14 px-6 focus:ring-1 focus:ring-primary" placeholder="https://images.unsplash.com/..." />
                  </div>
                  <Button type="submit" className="w-full py-8 rounded-2xl bg-black text-white font-bold uppercase tracking-[0.3em] text-xs mt-6 hover:bg-neutral-800 transition-all">Confirmar Creación</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {courses.map(course => (
              <div key={course.id} onClick={() => setSelectedCourse(course.id)} className={cn("group relative p-5 rounded-[3.5rem] border bg-white transition-all duration-700 cursor-pointer shadow-soft", selectedCourse === course.id ? "border-primary border-4 shadow-2xl -translate-y-2" : "border-neutral-100/50 hover:border-primary/20 hover:shadow-xl hover:-translate-y-1")}>
                <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-8 bg-neutral-100 border border-neutral-100 shadow-inner relative">
                  <img src={course.image_url || "/placeholder.svg"} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <ChevronRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-8 space-y-3">
                  <h3 className="font-serif text-2xl font-light text-neutral-900 uppercase tracking-wide leading-tight">{course.title}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Slug: {course.slug}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contenido" className="space-y-10 animate-in fade-in duration-700">
          <Card className="rounded-[3.5rem] p-16 border-none shadow-soft bg-white">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-12 mb-12">
              <div>
                <h3 className="font-serif text-4xl font-light uppercase tracking-widest text-neutral-900">{selectedCourseData?.title}</h3>
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mt-2 italic">Constructor de Currículum</p>
              </div>
              <Button onClick={() => setIsModuleDialogOpen(true)} className="rounded-full px-12 py-7 bg-black text-white font-bold uppercase tracking-widest hover:bg-neutral-800 gap-3">
                <Plus className="w-4 h-4" /> Nuevo Módulo
              </Button>
            </div>

            <div className="space-y-8">
              <div className="bg-neutral-50/50 rounded-[3rem] p-10 border border-dashed border-neutral-200 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-serif text-xl text-neutral-700">Sube tus Contenidos</p>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mt-1">MP4, MOV o enlaces de Vimeo</p>
                </div>
                <Input type="file" className="hidden" id="admin-upload" />
                <Label htmlFor="admin-upload" className="inline-block cursor-pointer px-10 py-4 bg-white border border-neutral-200 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-50 transition-colors">Seleccionar Archivos</Label>
              </div>

              <div className="space-y-6">
                {modules.map((mod, mIdx) => (
                  <Accordion key={mod.id} type="single" collapsible className="w-full">
                    <AccordionItem value={mod.id} className="border rounded-[2.5rem] px-10 bg-white overflow-hidden shadow-sm border-neutral-100">
                      <AccordionTrigger className="py-8 hover:no-underline font-serif text-xl font-light uppercase tracking-widest">
                        {mIdx + 1}. {mod.title}
                      </AccordionTrigger>
                      <AccordionContent className="pb-10">
                        <div className="pt-4 border-t border-neutral-50 space-y-4">
                          {videos.filter(v => v.module_id === mod.id).map((video, vIdx) => (
                            <div key={video.id} className="flex items-center justify-between p-5 rounded-2xl hover:bg-neutral-50 group">
                              <div className="flex items-center gap-5">
                                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                  <Play className="w-4 h-4 fill-primary" />
                                </div>
                                <span className="text-sm font-bold text-neutral-600 uppercase tracking-wide">{video.title}</span>
                              </div>
                              <Button variant="ghost" size="icon" className="text-neutral-300 hover:text-red-400 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-10 animate-in fade-in duration-700">
          <Card className="rounded-[3.5rem] p-16 border-none shadow-soft bg-white">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-12 mb-12">
              <h3 className="font-serif text-4xl font-light uppercase tracking-widest text-neutral-900">Configuración de Ventas</h3>
              <Button onClick={handleSaveMarketing} className="rounded-full px-12 py-7 bg-black text-white font-bold uppercase tracking-widest hover:bg-neutral-800 gap-3">
                <Save className="w-4 h-4" /> Guardar Cambios
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="space-y-12">
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 ml-1">Descripción del Programa</Label>
                  <Textarea
                    value={selectedCourseData?.long_description || ""}
                    onChange={e => updateCourseMarketing({ long_description: e.target.value })}
                    rows={10}
                    className="rounded-[2.5rem] border-neutral-100 bg-[#FAF9F6] p-10 focus:ring-1 focus:ring-primary outline-none text-neutral-600 leading-relaxed"
                    placeholder="Describe los beneficios y resultados del curso..."
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 ml-1">Miniatura Pública (URL)</Label>
                  <Input
                    value={selectedCourseData?.image_url || ""}
                    onChange={e => updateCourseMarketing({ image_url: e.target.value })}
                    className="rounded-[2rem] border-neutral-100 bg-[#FAF9F6] h-16 px-8"
                  />
                </div>
              </div>

              <div className="bg-[#FAF9F6] rounded-[3rem] p-12 space-y-12 border border-neutral-100">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary italic">Detalles del Autor</h4>
                <div className="space-y-8">
                  <div className="flex gap-10 items-end">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-neutral-200 overflow-hidden border-4 border-white shadow-xl bg-white">
                      <img src={selectedCourseData?.author_image_url || "/placeholder.svg"} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <Label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Nombre Visible</Label>
                      <Input value={selectedCourseData?.author_name || ""} onChange={e => updateCourseMarketing({ author_name: e.target.value })} className="rounded-2xl border-neutral-200 h-14 bg-white shadow-sm" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Título / Especialidad</Label>
                    <Input value={selectedCourseData?.author_role || ""} onChange={e => updateCourseMarketing({ author_role: e.target.value })} className="rounded-2xl border-neutral-200 h-14 bg-white shadow-sm" />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Avatar URL</Label>
                    <Input value={selectedCourseData?.author_image_url || ""} onChange={e => updateCourseMarketing({ author_image_url: e.target.value })} className="rounded-2xl border-neutral-200 h-14 bg-white shadow-sm" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
        <DialogContent className="rounded-[3rem] p-12 max-w-xl border-none shadow-2xl bg-white">
          <DialogHeader className="mb-10">
            <DialogTitle className="font-serif text-3xl font-light uppercase tracking-widest">Añadir Módulo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateModule} className="space-y-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 ml-1">Título del Módulo</Label>
              <Input value={newModuleForm.title} onChange={e => setNewModuleForm({ ...newModuleForm, title: e.target.value })} className="rounded-2xl border-neutral-100 bg-[#FAF9F6] h-14 px-6 focus:ring-1 focus:ring-primary" placeholder="Ej: Introducción al Ayurveda" />
            </div>
            <Button type="submit" className="w-full py-8 rounded-2xl bg-black text-white font-bold uppercase tracking-[0.3em] text-xs mt-6 hover:bg-neutral-800 transition-all">Guardar Módulo</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoUploadManager;
