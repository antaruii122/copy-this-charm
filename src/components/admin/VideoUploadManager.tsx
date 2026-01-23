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
    Eye,
    Maximize2,
    ImagePlus,
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
    ChevronRight,
    Cloud,
    Play
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
import { Separator } from "@/components/ui/separator";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Tables } from "@/integrations/supabase/types";
import { useGoogleDrivePicker } from "@/hooks/useGoogleDrivePicker";

// Temporarily extend types until we can make them stricter or db schema is fully aligned
type Course = Tables<"courses"> & {
    card_style?: string;
    original_price?: string;
    badge_text?: string;
    border_color?: string;
    color_theme?: string;
    border_theme?: string;
};
type CourseVideo = Tables<"course_videos"> & { is_drive_video?: boolean };
type Module = Tables<"modules">;

import RichTextEditor from "@/components/ui/rich-text-editor";
import LessonResourceManager from "@/components/admin/LessonResourceManager";
import { Checkbox } from "@/components/ui/checkbox";

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

    // New state for advanced video editing dialog
    const [advancedEditingVideo, setAdvancedEditingVideo] = useState<CourseVideo | null>(null);
    const [isAdvancedEditDialogOpen, setIsAdvancedEditDialogOpen] = useState(false);
    const [newAdminEmail, setNewAdminEmail] = useState("");
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("cursos");

    // Google Drive integration
    const [uploadMethod, setUploadMethod] = useState<'local' | 'drive'>('local');
    const { selectFromDrive, isLoading: isDriveLoading } = useGoogleDrivePicker();
    const [lastUploadedVideo, setLastUploadedVideo] = useState<{ name: string, embedUrl: string } | null>(null);
    const [videoToPreview, setVideoToPreview] = useState<CourseVideo | null>(null);

    const [newCourseForm, setNewCourseForm] = useState({
        title: "",
        slug: "",
        description: "",
        price: "" as string | number,
        image_url: "",
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
        thumbnail_url: "",
        duration_seconds: 0,
    });

    const [newModuleForm, setNewModuleForm] = useState({
        title: "",
        description: "",
    });

    const selectedCourseData = courses.find(c => c.id === selectedCourse);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const handleImageUpload = async (file: File) => {
        try {
            setIsUploadingImage(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `thumbnails/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('videodecurso')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('videodecurso_new')
                .getPublicUrl(fileName);

            return publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            toast({
                title: "Error",
                description: "No se pudo subir la imagen",
                variant: "destructive"
            });
            return null;
        } finally {
            setIsUploadingImage(false);
        }
    };

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
                    image_url: selectedCourseData.image_url,
                    title: selectedCourseData.title,
                    slug: selectedCourseData.slug,
                    description: selectedCourseData.description,
                    price: selectedCourseData.price,
                    card_style: selectedCourseData.card_style,
                    original_price: selectedCourseData.original_price,
                    badge_text: selectedCourseData.badge_text,
                    border_color: selectedCourseData.border_color,
                    color_theme: selectedCourseData.color_theme,
                    border_theme: selectedCourseData.border_theme,
                })
                .eq("id", selectedCourse);

            if (error) throw error;
            toast({ title: "Cambios guardados", description: "La información de marketing ha sido actualizada." });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error desconocido";
            toast({ title: "Error al guardar", description: errorMessage, variant: "destructive" });
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
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (isAdmin) {
            fetchCourses();
            fetchAdminEmails();
        }
    }, [isAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (selectedCourse) {
            fetchCourseModules(selectedCourse);
            fetchCourseVideos(selectedCourse);
            setVideoMetadata(prev => ({ ...prev, course_id: selectedCourse }));
        }
    }, [selectedCourse]); // eslint-disable-line react-hooks/exhaustive-deps

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
            setCourses((data as Course[]) || []);
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
        } catch (error) {
            console.error("Error adding admin email:", error);
            const errorMessage = error instanceof Error ? error.message : "No se pudo añadir el administrador";
            toast({
                title: "Error",
                description: errorMessage,
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

            await fetchAdminEmails();
            toast({ title: "Administrador eliminado correctamente" });
        } catch (error) {
            console.error("Error deleting admin email:", error);
            const errorMessage = error instanceof Error ? error.message : "No se pudo eliminar el administrador";
            toast({
                title: "Error",
                description: errorMessage,
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
                    image_url: newCourseForm.image_url || null,
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
        } catch (error) {
            console.error("Error creating course:", error);
            const errorMessage = error instanceof Error ? error.message : "No se pudo crear el curso";
            toast({
                title: "Error",
                description: errorMessage,
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
        } catch (error) {
            console.error("Error creating module:", error);
            const errorMessage = error instanceof Error ? error.message : "No se pudo crear el módulo";
            toast({
                title: "Error",
                description: errorMessage,
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
        } catch (error) {
            console.error("Error updating module:", error);
            const errorMessage = error instanceof Error ? error.message : "No se pudo actualizar el módulo";
            toast({
                title: "Error",
                description: errorMessage,
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
        } catch (error) {
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

    const getVideoDuration = (file: File): Promise<number> => {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                resolve(Math.round(video.duration));
            };
            video.onerror = () => {
                resolve(0);
            }
            video.src = window.URL.createObjectURL(file);
        });
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
            // Get duration BEFORE upload
            const duration = await getVideoDuration(file);
            console.log(`Duration calculated for ${file.name}: ${duration}s`);

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("videodecurso_new")
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
                    thumbnail_url: videoMetadata.thumbnail_url || null,
                    duration_seconds: duration, // SAVING CORRECT DURATION
                });

            if (dbError) throw dbError;

            // Update progress to complete
            setUploadProgress((prev) =>
                prev.map((p, i) =>
                    i === index ? { ...p, progress: 100, status: "success" } : p
                )
            );

            // Set last uploaded video for preview
            const { data: { publicUrl } } = supabase.storage
                .from("videodecurso_new")
                .getPublicUrl(fileName);

            setLastUploadedVideo({
                name: videoTitle,
                embedUrl: publicUrl
            });
        } catch (error) {
            console.error("FULL UPLOAD ERROR DETAILS:", JSON.stringify(error, null, 2));
            if (error instanceof Error) {
                console.error("Error Message:", error.message);
                console.error("Error Stack:", error.stack);
            }
            const errorMessage = error instanceof Error ? error.message : "Error desconocido";
            setUploadProgress((prev) =>
                prev.map((p, i) =>
                    i === index
                        ? { ...p, status: "error", error: errorMessage }
                        : p
                )
            );
            throw error;
        }
    };

    const handleDriveUpload = async () => {
        if (!selectedCourse) {
            toast({
                title: "Error",
                description: "Selecciona un curso primero",
                variant: "destructive",
            });
            return;
        }

        try {
            const driveFile = await selectFromDrive();

            if (!driveFile) {
                // User cancelled
                return;
            }

            console.log('Drive file selected:', driveFile);
            console.log('Video metadata:', videoMetadata);

            // Prepare insert data
            const insertData = {
                title: videoMetadata.title || driveFile.name,
                video_path: driveFile.embedUrl,
                course_id: selectedCourse,
                module_id: videoMetadata.module_id === "none" || !videoMetadata.module_id ? null : videoMetadata.module_id,
                sort_order: videoMetadata.sort_order || 0,
                is_drive_video: true,
                drive_file_id: driveFile.id,
                duration_seconds: videoMetadata.duration_seconds || 0, // SAVE THE MANUAL DURATION
            };

            console.log('Inserting data:', insertData);

            // Insert video with Drive URL
            const { data, error } = await supabase
                .from("course_videos")
                .insert(insertData)
                .select();

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }

            console.log('Insert successful:', data);

            // Store for preview
            setLastUploadedVideo({
                name: driveFile.name,
                embedUrl: driveFile.embedUrl
            });

            toast({
                title: "Video de Google Drive añadido",
                description: `"${driveFile.name}" se agregó correctamente`,
            });

            // Reset form
            setVideoMetadata({
                title: "",
                description: "",
                course_id: selectedCourse,
                module_id: "none",
                sort_order: 0,
                thumbnail_url: "",
                duration_seconds: 0,
            });

            fetchCourseVideos(selectedCourse);
        } catch (error) {
            console.error("Error adding Drive video:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "No se pudo añadir el video de Drive",
                variant: "destructive",
            });
        }
    };

    const handleDeleteVideo = async (videoId: string, videoPath: string) => {
        if (!confirm("¿Estás seguro de eliminar este video?")) return;

        try {
            // Delete from storage
            const { error: storageError } = await supabase.storage
                .from("videodecurso_new")
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
        } catch (error) {
            console.error("Error deleting video:", error);
            const errorMessage = error instanceof Error ? error.message : "No se pudo eliminar el video";
            toast({
                title: "Error",
                description: errorMessage,
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
        } catch (error) {
            console.error("Error updating video:", error);
            const errorMessage = error instanceof Error ? error.message : "No se pudo actualizar el video";
            toast({
                title: "Error",
                description: errorMessage,
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
        <div className="space-y-10 pb-20 bg-background text-foreground">
            <header className="relative py-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-4">
                            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                            <span className="text-primary text-[10px] font-bold tracking-widest uppercase">Sistema de Gestión Premium</span>
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground tracking-tight uppercase">
                            Administración de <span className="text-primary italic underline decoration-primary/30 underline-offset-8">Cursos</span>
                        </h1>
                        <p className="text-muted-foreground mt-4 text-lg max-w-2xl leading-relaxed">
                            Gestiona el contenido de tus cursos, organiza módulos y administra los permisos de acceso de tu equipo.
                        </p>
                    </div>
                </div>
            </header>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="bg-muted p-1 rounded-2xl border border-border backdrop-blur-sm">
                    <TabsTrigger value="cursos" className="rounded-xl gap-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-white">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-primary text-[10px] font-bold mr-1">1</span>
                        Elegir Programa
                    </TabsTrigger>
                    <TabsTrigger value="contenido" className="rounded-xl gap-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-white" disabled={!selectedCourse}>
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-primary text-[10px] font-bold mr-1">2</span>
                        Añadir Contenido
                    </TabsTrigger>
                    <TabsTrigger value="admins" className="rounded-xl gap-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-white">
                        <Users className="w-4 h-4" />
                        Accesos
                    </TabsTrigger>
                    <TabsTrigger value="marketing" className="rounded-xl gap-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-white" disabled={!selectedCourse}>
                        <Layout className="w-4 h-4" />
                        Detalles
                    </TabsTrigger>
                    <TabsTrigger value="ajustes" className="rounded-xl gap-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-white">
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
                                        <Label>Imagen de Portada</Label>
                                        <div className="flex gap-4 items-center">
                                            {newCourseForm.image_url && (
                                                <img src={newCourseForm.image_url} alt="Preview" className="w-16 h-16 object-cover rounded-md border" />
                                            )}
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const url = await handleImageUpload(file);
                                                        if (url) setNewCourseForm({ ...newCourseForm, image_url: url });
                                                    }
                                                }}
                                                disabled={isUploadingImage}
                                            />
                                        </div>
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
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
                                    onClick={() => {
                                        setSelectedCourse(course.id);
                                        setActiveTab("contenido");
                                    }}
                                    className={cn(
                                        "group relative rounded-3xl border bg-white cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden flex flex-col",
                                        selectedCourse === course.id
                                            ? "border-primary border-2 shadow-[0_0_20px_rgba(191,89,103,0.1)] scale-[1.02]"
                                            : "hover:border-primary/20",
                                        "aspect-[9/16]" // Enforce 9:16 aspect ratio
                                    )}
                                    style={{
                                        borderColor: course.border_theme || 'transparent',
                                        borderWidth: course.border_theme ? '2px' : '0px',
                                        borderStyle: course.border_theme ? 'solid' : 'none'
                                    }}
                                >
                                    {/* CLASIC VERTICAL SPLIT DESIGN (Option B) */}
                                    {/* Image Top (45%) */}
                                    <div className="h-[45%] w-full relative bg-muted/20 border-b overflow-hidden">
                                        {course.image_url ? (
                                            <img
                                                src={course.image_url}
                                                alt={course.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                                                <Video className="w-8 h-8 text-primary/20" />
                                            </div>
                                        )}
                                        {course.is_featured && (
                                            <div className="absolute top-2 right-2">
                                                <span className="text-[9px] font-bold text-primary px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full uppercase border border-primary/20 shadow-sm">
                                                    Destacado
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Bottom (55%) */}
                                    <div className={cn(
                                        "h-[55%] w-full flex flex-col p-4",
                                        course.card_style === 'elegant' ? "bg-[#F4F6F4]" : // Sage Tint
                                            course.card_style === 'bold' ? "bg-primary text-primary-foreground" :
                                                "bg-white" // Standard Minimal
                                    )}>
                                        {/* Badge */}
                                        <div className="mb-2">
                                            <span className={cn(
                                                "text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm",
                                                course.card_style === 'bold' ? "bg-white/20 text-white" : "bg-primary/5 text-primary"
                                            )}>
                                                {course.badge_text || (course.price ? "Premium" : "Gratis")}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className={cn(
                                            "font-serif text-lg font-bold leading-tight line-clamp-2 mb-2",
                                            course.card_style === 'bold' ? "text-white" : "text-gray-900"
                                        )}>
                                            {course.title}
                                        </h3>

                                        {/* Description */}
                                        <p className={cn(
                                            "text-xs line-clamp-2 mb-4 flex-1",
                                            course.card_style === 'bold' ? "text-white/80" : "text-muted-foreground"
                                        )}>
                                            {course.description || "Sin descripción proporcionada."}
                                        </p>

                                        {/* Footer: Price & Edit */}
                                        <div className="flex items-end justify-between mt-auto pt-3 border-t border-border/10">
                                            <div className="flex flex-col">
                                                {course.original_price && (
                                                    <span className={cn(
                                                        "text-[10px] line-through",
                                                        course.card_style === 'bold' ? "text-white/60" : "text-muted-foreground/70"
                                                    )}>
                                                        {course.original_price}
                                                    </span>
                                                )}
                                                <span className={cn(
                                                    "text-sm font-bold",
                                                    course.card_style === 'bold' ? "text-white" : "text-primary"
                                                )}>
                                                    {course.price || "Gratis"}
                                                </span>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={cn(
                                                    "h-8 w-8 p-0 rounded-full hover:bg-black/5",
                                                    course.card_style === 'bold' ? "text-white hover:text-white hover:bg-white/20" : "text-muted-foreground hover:text-primary"
                                                )}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedCourse(course.id);
                                                    setActiveTab("marketing");
                                                }}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </div>
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
                                        <Upload className="w-5 h-5 text-primary" />
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

                                        {/* Thumbnail Upload */}
                                        <div className="space-y-2">
                                            <Label htmlFor="video-thumbnail" className="text-sm font-medium ml-1 flex items-center gap-2">
                                                <ImagePlus className="w-4 h-4" />
                                                Miniatura del Video (Opcional)
                                            </Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="file"
                                                    id="video-thumbnail"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const url = await handleImageUpload(file);
                                                            if (url) {
                                                                setVideoMetadata({ ...videoMetadata, thumbnail_url: url });
                                                                toast({ title: "Miniatura subida", description: "La miniatura se ha subido correctamente" });
                                                            }
                                                        }
                                                    }}
                                                    className="rounded-xl h-12 bg-background/50"
                                                    disabled={isUploadingImage}
                                                />
                                                {videoMetadata.thumbnail_url && (
                                                    <div className="relative w-20 h-12 rounded-lg overflow-hidden border border-border">
                                                        <img
                                                            src={videoMetadata.thumbnail_url}
                                                            alt="Thumbnail preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            {isUploadingImage && (
                                                <p className="text-xs text-muted-foreground">Subiendo miniatura...</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Upload Method Tabs OR Video Preview */}
                                    {lastUploadedVideo ? (
                                        <div className="space-y-4">
                                            <div className="rounded-xl overflow-hidden border border-border/50 bg-black">
                                                <iframe
                                                    src={lastUploadedVideo.embedUrl}
                                                    className="w-full aspect-video"
                                                    allow="autoplay; encrypted-media"
                                                    allowFullScreen
                                                    title={lastUploadedVideo.name}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                        <p className="text-sm font-semibold text-foreground">{lastUploadedVideo.name}</p>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground ml-6">El video se ha añadido correctamente a la estructura curricular.</p>
                                                </div>
                                                <Button
                                                    onClick={() => {
                                                        setLastUploadedVideo(null);
                                                    }}
                                                    className="rounded-xl gap-2"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Subir Otro Video
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v as 'local' | 'drive')} className="w-full">
                                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                                    <TabsTrigger value="local" className="gap-2">
                                                        <Upload className="w-4 h-4" />
                                                        Subir desde Computadora
                                                    </TabsTrigger>
                                                    <TabsTrigger value="drive" className="gap-2">
                                                        <Cloud className="w-4 h-4" />
                                                        Google Drive
                                                    </TabsTrigger>
                                                </TabsList>

                                                <TabsContent value="local" className="mt-0">
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
                                                </TabsContent>

                                                <TabsContent value="drive" className="mt-0">
                                                    <div className="border-2 border-dashed border-primary/20 rounded-2xl p-10 text-center bg-primary/5">
                                                        <div className="flex flex-col items-center gap-4">
                                                            <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-sm">
                                                                <Cloud className="w-8 h-8 text-primary" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-foreground mb-1">
                                                                    Selecciona un video de tu Google Drive
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    El video debe estar configurado como "Cualquiera con el enlace puede ver"
                                                                </p>
                                                            </div>

                                                            {/* New Manual Duration Input */}
                                                            <div className="w-full max-w-xs space-y-2 text-left">
                                                                <Label htmlFor="drive-duration" className="text-xs font-semibold uppercase text-muted-foreground">
                                                                    Duración (Segundos)
                                                                </Label>
                                                                <Input
                                                                    id="drive-duration"
                                                                    type="number"
                                                                    placeholder="Ej: 300 para 5 min"
                                                                    value={videoMetadata.duration_seconds || ""}
                                                                    onChange={(e) => setVideoMetadata({ ...videoMetadata, duration_seconds: parseInt(e.target.value) || 0 })}
                                                                    className="text-center rounded-xl border-dashed"
                                                                />
                                                                <p className="text-[10px] text-muted-foreground text-center">
                                                                    *Introduce la duración manual ya que Drive no la comparte.
                                                                </p>
                                                            </div>

                                                            <Button
                                                                onClick={handleDriveUpload}
                                                                disabled={isDriveLoading || !selectedCourse}
                                                                className="rounded-xl gap-2 w-full max-w-xs"
                                                            >
                                                                {isDriveLoading ? (
                                                                    <>
                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                        Abriendo Drive...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Cloud className="w-4 h-4" />
                                                                        Seleccionar de Google Drive
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </TabsContent>
                                            </Tabs>

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
                                        </>
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
                                                            setVideoToPreview={setVideoToPreview}
                                                            handleUpdateVideo={handleUpdateVideo}
                                                            handleDeleteVideo={handleDeleteVideo}
                                                            modules={modules}
                                                            onEditAdvanced={(v) => {
                                                                setAdvancedEditingVideo(v);
                                                                setIsAdvancedEditDialogOpen(true);
                                                            }}
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
                                                        setVideoToPreview={setVideoToPreview}
                                                        handleUpdateVideo={handleUpdateVideo}
                                                        handleDeleteVideo={handleDeleteVideo}
                                                        modules={modules}
                                                        onEditAdvanced={(v) => {
                                                            setAdvancedEditingVideo(v);
                                                            setIsAdvancedEditDialogOpen(true);
                                                        }}
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
                            <CardHeader className="pb-8 pt-10 px-10 text-center">
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
                        <div className="space-y-8">
                            <Card className="rounded-3xl border-none shadow-xl bg-white p-8 space-y-6 lg:col-span-2">
                                <div className="space-y-2 flex justify-between items-end">
                                    <div>
                                        <h3 className="font-serif text-2xl font-bold">Editor de Tarjeta</h3>
                                        <p className="text-sm text-muted-foreground">Diseña y personaliza tu curso en tiempo real.</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="hidden lg:block">
                                            <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                Vista Previa Activa
                                            </span>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleSaveMarketing()}
                                            className="rounded-full bg-primary text-white hover:bg-primary/90 shadow-sm"
                                        >
                                            <Save className="w-3.5 h-3.5 mr-1.5" />
                                            Guardar
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                    {/* Left Column: Form Controls (7 cols) */}
                                    <div className="lg:col-span-7 space-y-8">

                                        {/* 1. Basic Info */}
                                        <div className="space-y-5">
                                            <div className="space-y-2">
                                                <Label className="text-base font-semibold">1. Información del Curso</Label>
                                                <Input
                                                    placeholder="Título del Curso"
                                                    value={selectedCourseData.title}
                                                    onChange={(e) => updateCourseMarketing({ title: e.target.value })}
                                                    className="font-serif text-lg"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Textarea
                                                    placeholder="Descripción Corta (Max 150 caracteres)"
                                                    className="resize-none h-24"
                                                    value={selectedCourseData.description || ""}
                                                    onChange={(e) => updateCourseMarketing({ description: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="w-full h-px bg-border/50"></div>

                                        {/* 2. Visuals */}
                                        <div className="space-y-5">
                                            <Label className="text-base font-semibold">2. Identidad Visual</Label>

                                            {/* Image Upload */}
                                            <div className="p-4 bg-muted/20 rounded-2xl border border-dashed border-border/60 hover:bg-muted/30 transition-colors cursor-pointer group relative">
                                                <div className="flex gap-4 items-center">
                                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                                                        <ImagePlus className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium text-gray-900">Subir Imagen de Portada</div>
                                                        <div className="text-xs text-muted-foreground">Vertical (9:16) recomendada.</div>
                                                    </div>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const url = await handleImageUpload(file);
                                                                if (url) updateCourseMarketing({ image_url: url });
                                                            }
                                                        }}
                                                        disabled={isUploadingImage}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                            </div>

                                            {/* COLOR PICKERS */}
                                            <div className="grid grid-cols-2 gap-6 pt-2">
                                                <div className="space-y-3">
                                                    <Label>Color de Fondo</Label>
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-sm border ring-1 ring-black/5 hover:scale-105 transition-transform">
                                                            <input
                                                                type="color"
                                                                value={selectedCourseData.color_theme || '#ffffff'}
                                                                onChange={(e) => updateCourseMarketing({ color_theme: e.target.value })}
                                                                className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 border-0"
                                                            />
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            Clic para elegir<br /> cualquier color
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <Label>Color de Borde</Label>
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-sm border ring-1 ring-black/5 hover:scale-105 transition-transform">
                                                            <input
                                                                type="color"
                                                                value={selectedCourseData.border_theme || '#e5e7eb'}
                                                                onChange={(e) => updateCourseMarketing({ border_theme: e.target.value })}
                                                                className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 border-0"
                                                            />
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            Define el marco<br /> de la tarjeta
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full h-px bg-border/50"></div>

                                        {/* 3. Details */}
                                        <div className="space-y-5">
                                            <Label className="text-base font-semibold">3. Detalles de Venta</Label>
                                            <div className="grid grid-cols-2 gap-5">
                                                <div className="space-y-2">
                                                    <Label>Texto Destacado (Opcional)</Label>
                                                    <Input
                                                        placeholder="Ej: OFERTA, NUEVO..."
                                                        value={selectedCourseData.badge_text || ""}
                                                        onChange={(e) => updateCourseMarketing({ badge_text: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Precio Normal (Tachado)</Label>
                                                    <Input
                                                        placeholder="Ej: $197..."
                                                        value={selectedCourseData.original_price || ""}
                                                        onChange={(e) => updateCourseMarketing({ original_price: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2 col-span-2">
                                                    <Label>Precio Actual (Final)</Label>
                                                    <Input
                                                        value={selectedCourseData.price || ""}
                                                        onChange={(e) => updateCourseMarketing({ price: e.target.value })}
                                                        placeholder="Ej: $97 USD"
                                                        className="font-bold bg-muted/20"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Live Preview (5 cols) */}
                                    <div className="lg:col-span-5 relative">
                                        <div className="sticky top-8">

                                            {/* Zoom / Info Hint */}
                                            <div className="flex justify-center mb-4 opacity-50 hover:opacity-100 transition-opacity">
                                                <span className="text-[10px] uppercase tracking-widest flex items-center gap-1.5 cursor-help">
                                                    <Eye className="w-3 h-3" /> Vista Previa Real
                                                </span>
                                            </div>

                                            {/* Preview Card Component */}
                                            {/* Added onClick to expand logic */}
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <div className="mx-auto max-w-[280px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] rounded-[2rem] transform transition-all duration-500 hover:scale-[1.02] cursor-zoom-in relative group">
                                                        {/* Hover Overlay Hint */}
                                                        {/* Hover Overlay Hint & Persistent Button */}
                                                        <div className="absolute inset-0 bg-black/0 z-20 rounded-[2rem] transition-colors flex items-center justify-center pointer-events-none" />

                                                        <div
                                                            className="overflow-hidden flex flex-col aspect-[9/16] rounded-[2rem] bg-white relative z-10"
                                                            style={{
                                                                borderColor: selectedCourseData.border_theme || 'transparent',
                                                                borderWidth: selectedCourseData.border_theme ? '4px' : '0px',
                                                                borderStyle: 'solid'
                                                            }}
                                                        >

                                                            {/* Preview: Image Top (45%) */}
                                                            <div className="h-[45%] w-full relative bg-muted/20 border-b overflow-hidden">
                                                                {selectedCourseData.image_url ? (
                                                                    <img
                                                                        src={selectedCourseData.image_url}
                                                                        alt="Preview"
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                                                                        <Video className="w-8 h-8 text-primary/20" />
                                                                    </div>
                                                                )}
                                                                {/* Example Featured Tag */}
                                                                <div className="absolute top-3 right-3 opacity-90">
                                                                    <span className="text-[9px] font-bold text-primary px-2.5 py-1 bg-white/95 rounded-full uppercase border border-primary/20 shadow-sm">
                                                                        Destacado
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Preview: Content Bottom (55%) */}
                                                            <div
                                                                className="h-[55%] w-full flex flex-col p-6 text-left"
                                                                style={{ backgroundColor: selectedCourseData.color_theme || '#ffffff' }}
                                                            >
                                                                {/* Dynamic Text Contrast Logic (Simple) */}
                                                                {(() => {
                                                                    const bgColor = selectedCourseData.color_theme || '#ffffff';
                                                                    const isWhite = bgColor.toLowerCase() === '#ffffff';
                                                                    const textColor = isWhite ? '#111827' : '#ffffff';
                                                                    const subTextColor = isWhite ? '#6b7280' : 'rgba(255,255,255,0.8)';
                                                                    const badgeBg = isWhite ? 'rgba(191, 89, 103, 0.1)' : 'rgba(255,255,255,0.2)';
                                                                    const badgeText = isWhite ? '#bf5967' : '#ffffff';

                                                                    return (
                                                                        <>
                                                                            <div className="mb-3">
                                                                                <span
                                                                                    className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-sm inline-block"
                                                                                    style={{ backgroundColor: badgeBg, color: badgeText }}
                                                                                >
                                                                                    {selectedCourseData.badge_text || "PROGRAMA"}
                                                                                </span>
                                                                            </div>

                                                                            <h3
                                                                                className="font-serif text-xl font-bold leading-tight line-clamp-2 mb-2"
                                                                                style={{ color: textColor }}
                                                                            >
                                                                                {selectedCourseData.title || "Título del Curso"}
                                                                            </h3>

                                                                            <p
                                                                                className="text-sm line-clamp-3 mb-4 flex-1 leading-relaxed"
                                                                                style={{ color: subTextColor }}
                                                                            >
                                                                                {selectedCourseData.description || "Descripción corta del curso..."}
                                                                            </p>

                                                                            <div className="flex items-end justify-between mt-auto pt-3 border-t border-black/5">
                                                                                <div className="flex flex-col">
                                                                                    {selectedCourseData.original_price && (
                                                                                        <span
                                                                                            className="text-[10px] line-through mb-0.5"
                                                                                            style={{ color: subTextColor, opacity: 0.7 }}
                                                                                        >
                                                                                            {selectedCourseData.original_price}
                                                                                        </span>
                                                                                    )}
                                                                                    <span
                                                                                        className="text-lg font-bold"
                                                                                        style={{ color: textColor }}
                                                                                    >
                                                                                        {selectedCourseData.price || "Gratis"}
                                                                                    </span>
                                                                                </div>

                                                                                <div />
                                                                            </div>
                                                                        </>
                                                                    );
                                                                })()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-md bg-transparent border-none shadow-none p-0 flex items-center justify-center">
                                                    <div
                                                        className="w-[360px] overflow-hidden flex flex-col aspect-[9/16] rounded-[2rem] bg-white relative shadow-2xl scale-110"
                                                        style={{
                                                            borderColor: selectedCourseData.border_theme || 'transparent',
                                                            borderWidth: selectedCourseData.border_theme ? '4px' : '0px',
                                                            borderStyle: 'solid'
                                                        }}
                                                    >
                                                        <div className="h-[45%] w-full relative bg-muted/20 border-b overflow-hidden">
                                                            {selectedCourseData.image_url ? (
                                                                <img
                                                                    src={selectedCourseData.image_url}
                                                                    alt="Preview"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : <div className="bg-gray-100 w-full h-full" />}
                                                        </div>
                                                        <div
                                                            className="h-[55%] w-full flex flex-col p-6 text-left"
                                                            style={{ backgroundColor: selectedCourseData.color_theme || '#ffffff' }}
                                                        >
                                                            {/* Actual Preview Content in Modal */}
                                                            {(() => {
                                                                const bgColor = selectedCourseData.color_theme || '#ffffff';
                                                                const isWhite = bgColor.toLowerCase() === '#ffffff';
                                                                const textColor = isWhite ? '#111827' : '#ffffff';
                                                                const subTextColor = isWhite ? '#6b7280' : 'rgba(255,255,255,0.8)';
                                                                const badgeBg = isWhite ? 'rgba(191, 89, 103, 0.1)' : 'rgba(255,255,255,0.2)';
                                                                const badgeText = isWhite ? '#bf5967' : '#ffffff';

                                                                return (
                                                                    <>
                                                                        <div className="mb-3">
                                                                            <span
                                                                                className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-sm inline-block"
                                                                                style={{ backgroundColor: badgeBg, color: badgeText }}
                                                                            >
                                                                                {selectedCourseData.badge_text || "PROGRAMA"}
                                                                            </span>
                                                                        </div>

                                                                        <h3
                                                                            className="font-serif text-xl font-bold leading-tight line-clamp-2 mb-2"
                                                                            style={{ color: textColor }}
                                                                        >
                                                                            {selectedCourseData.title || "Título del Curso"}
                                                                        </h3>

                                                                        <p
                                                                            className="text-sm line-clamp-3 mb-4 flex-1 leading-relaxed"
                                                                            style={{ color: subTextColor }}
                                                                        >
                                                                            {selectedCourseData.description || "Descripción corta del curso..."}
                                                                        </p>

                                                                        <div className="flex items-end justify-between mt-auto pt-3 border-t border-black/5">
                                                                            <div className="flex flex-col">
                                                                                {selectedCourseData.original_price && (
                                                                                    <span
                                                                                        className="text-[10px] line-through mb-0.5"
                                                                                        style={{ color: subTextColor, opacity: 0.7 }}
                                                                                    >
                                                                                        {selectedCourseData.original_price}
                                                                                    </span>
                                                                                )}
                                                                                <span
                                                                                    className="text-lg font-bold"
                                                                                    style={{ color: textColor }}
                                                                                >
                                                                                    {selectedCourseData.price || "Gratis"}
                                                                                </span>
                                                                            </div>

                                                                            <div />
                                                                        </div>
                                                                    </>
                                                                );
                                                            })()}
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="rounded-3xl border-none shadow-xl bg-white p-8 space-y-6 lg:col-span-2">
                                <div className="space-y-2">
                                    <h3 className="font-serif text-2xl font-bold">Multimedia & Marketing</h3>
                                    <p className="text-sm text-muted-foreground">Configura el contenido público que verán los interesados.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Descripción Larga (Editor Rico)</Label>
                                        <RichTextEditor
                                            placeholder="Describe el curso en detalle (puedes usar negritas, listas, etc)..."
                                            value={selectedCourseData.long_description || ""}
                                            onChange={(value) => updateCourseMarketing({ long_description: value })}
                                            className="min-h-[300px]"
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

                            <Card className="rounded-3xl border-none shadow-xl bg-white p-8 space-y-6 lg:col-span-2">
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
                                            className="w-full bg-primary text-white rounded-full hover:bg-primary/90"
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

                </TabsContent >
            </Tabs >

            {/* Dialog for Module Creation (Shared across tabs if needed) */}
            < Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen} >
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
            </Dialog >

            {/* Dialog for Video Preview */}
            < Dialog open={!!videoToPreview} onOpenChange={(open) => !open && setVideoToPreview(null)}>
                <DialogContent className="rounded-3xl border-none shadow-2xl max-w-4xl bg-black/95 p-0 overflow-hidden">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Vista Previa: {videoToPreview?.title}</DialogTitle>
                    </DialogHeader>

                    {videoToPreview && (
                        <div className="relative w-full aspect-video">
                            {videoToPreview.is_drive_video ? (
                                <iframe
                                    src={videoToPreview.video_path}
                                    className="w-full h-full"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                    title={videoToPreview.title}
                                />
                            ) : (
                                <video
                                    src={`https://baijfzqjgvgbfzuauroi.supabase.co/storage/v1/object/public/videodecurso/${videoToPreview.video_path}`}
                                    className="w-full h-full"
                                    controls
                                    autoPlay
                                />
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog >

            {/* Dialog for Advanced Video Editing (Rich Text & Settings) */}
            < Dialog open={isAdvancedEditDialogOpen} onOpenChange={(open) => {
                if (!open) setAdvancedEditingVideo(null);
                setIsAdvancedEditDialogOpen(open);
            }}>
                <DialogContent className="rounded-3xl border-none shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-2xl">Editar Contenido de Lección</DialogTitle>
                        <DialogDescription>Gestiona el contenido enriquecido y configuración de esta clase.</DialogDescription>
                    </DialogHeader>

                    {advancedEditingVideo && (
                        <div className="space-y-6 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Título de la Lección</Label>
                                    <Input
                                        value={advancedEditingVideo.title}
                                        onChange={(e) => setAdvancedEditingVideo({ ...advancedEditingVideo, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Módulo Asignado</Label>
                                    <Select
                                        value={advancedEditingVideo.module_id || "none"}
                                        onValueChange={(val) => setAdvancedEditingVideo({ ...advancedEditingVideo, module_id: val === "none" ? null : val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar Módulo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Sin Módulo (General)</SelectItem>
                                            {modules.map((mod) => (
                                                <SelectItem key={mod.id} value={mod.id}>
                                                    {mod.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Contenido de la Lección (Texto, Imágenes, Enlaces)</Label>
                                <div className="border rounded-md p-1 bg-muted/20">
                                    <RichTextEditor
                                        className="min-h-[300px]"
                                        value={advancedEditingVideo.content_text || ""}
                                        onChange={(val) => setAdvancedEditingVideo({ ...advancedEditingVideo, content_text: val })}
                                        placeholder="Escribe aquí el contenido de apoyo para la clase. Puedes incluir resumen, puntos clave, o enlaces..."
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    id="is_preview"
                                    checked={advancedEditingVideo.is_preview || false}
                                    onCheckedChange={(checked) => setAdvancedEditingVideo({ ...advancedEditingVideo, is_preview: checked as boolean })}
                                />
                                <Label htmlFor="is_preview" className="font-medium cursor-pointer">
                                    Esta lección es una Vista Previa Gratuita (Free Preview)
                                </Label>
                            </div>

                            <Separator className="my-6" />

                            <LessonResourceManager videoId={advancedEditingVideo.id} />

                            <div className="flex gap-3 pt-6 border-t mt-4">
                                <Button
                                    className="flex-1 rounded-xl"
                                    onClick={() => {
                                        if (advancedEditingVideo) {
                                            handleUpdateVideo(advancedEditingVideo);
                                            setIsAdvancedEditDialogOpen(false);
                                        }
                                    }}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Guardar Cambios
                                </Button>
                                <Button variant="outline" className="rounded-xl" onClick={() => setIsAdvancedEditDialogOpen(false)}>
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog >
        </div >
    );
};

const VideoTable = ({
    videos,
    editingVideo,
    setEditingVideo,
    setVideoToPreview,
    handleUpdateVideo,
    handleDeleteVideo,
    modules,
    onEditAdvanced
}: {
    videos: CourseVideo[];
    editingVideo: CourseVideo | null;
    setEditingVideo: (v: CourseVideo | null) => void;
    setVideoToPreview: (v: CourseVideo | null) => void;
    handleUpdateVideo: (v: CourseVideo) => void;
    handleDeleteVideo: (id: string, path: string) => void;
    modules: Module[];
    onEditAdvanced: (v: CourseVideo) => void;
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
                        <div
                            className="w-32 h-20 bg-sage rounded-xl overflow-hidden shadow-inner flex items-center justify-center border border-border group/preview relative cursor-pointer hover:ring-2 ring-primary/50 transition-all"
                            onClick={() => setVideoToPreview(video)}
                        >
                            {video.is_drive_video ? (
                                <div className="w-full h-full bg-black/10 flex items-center justify-center">
                                    <Cloud className="w-6 h-6 text-muted-foreground opacity-50" />
                                </div>
                            ) : (
                                <video
                                    src={`https://baijfzqjgvgbfzuauroi.supabase.co/storage/v1/object/public/videodecurso/${video.video_path}`}
                                    className="w-full h-full object-cover opacity-60 group-hover/preview:opacity-100 transition-opacity pointer-events-none"
                                    muted
                                    playsInline
                                />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity">
                                    <Play className="w-4 h-4 text-white fill-white" />
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
                                        title="Guardar Cambios Rápidos"
                                    >
                                        <Save className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setEditingVideo(null)}
                                        title="Cancelar"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="h-9 px-3 text-xs font-medium"
                                        onClick={() => onEditAdvanced(video)}
                                    >
                                        <ClipboardList className="w-3 h-3 mr-2" />
                                        Contenido
                                    </Button>

                                    <div className="w-px h-6 bg-border mx-1" />

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setEditingVideo(video)}
                                        title="Edición Rápida"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                            handleDeleteVideo(video.id, video.video_path)
                                        }
                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                        title="Eliminar Video"
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
