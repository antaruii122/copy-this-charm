import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
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
  X
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
} from "@/components/ui/dialog";
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
  title: string;
  description: string | null;
  video_path: string;
  sort_order: number;
  duration_seconds: number | null;
}

interface UploadProgress {
  fileName: string;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

const VideoUploadManager = () => {
  const { user } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<CourseVideo[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<CourseVideo | null>(null);
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
    sort_order: 0,
  });

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      fetchCourses();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (selectedCourse) {
      fetchCourseVideos(selectedCourse);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-3">
            <Video className="w-4 h-4 text-primary" />
            <span className="text-primary text-xs font-medium">ADMIN</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Gestión de Videos
          </h2>
          <p className="text-muted-foreground">
            Sube y administra los videos de tus cursos de manera profesional
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              Nuevo Curso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Curso</DialogTitle>
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
      </div>

      {/* Course Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Seleccionar Curso
          </CardTitle>
          <CardDescription>
            Elige el curso al que deseas agregar videos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un curso" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

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

          {/* Video List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Videos del Curso ({videos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {videos.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay videos en este curso todavía
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Orden</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Archivo</TableHead>
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
                              className="w-20"
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
                        <TableCell className="text-sm text-muted-foreground">
                          {video.video_path}
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
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default VideoUploadManager;
