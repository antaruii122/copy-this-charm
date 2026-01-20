import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUser, useAuth } from "@clerk/clerk-react";
import {
    ChevronLeft,
    X,
    Play,
    CheckCircle,
    Circle,
    ChevronRight,
    MessageSquare,
    Settings,
    Maximize,
    Volume2,
    Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

interface Video {
    id: string;
    title: string;
    video_path: string;
    module_id: string | null;
    sort_order: number | null;
    url?: string;
}

interface Module {
    id: string;
    title: string;
    sort_order: number;
}

const CoursePlayer = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken } = useAuth();
    const { toast } = useToast();

    const [course, setCourse] = useState<Tables<"courses"> | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [videos, setVideos] = useState<Video[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState<Record<string, boolean>>({});

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const init = async () => {
            const token = await getToken({ template: "supabase" });
            if (token) {
                await supabase.auth.setSession({ access_token: token, refresh_token: "" });
                await fetchData();
            }
        };

        const fetchData = async () => {
            try {
                // Get Course
                const { data: courseData } = await supabase.from("courses").select("*").eq("slug", slug).single();
                if (!courseData) return;
                setCourse(courseData);

                // Get Modules
                const { data: moduleData } = await supabase.from("modules").select("*").eq("course_id", courseData.id).order("sort_order");
                setModules(moduleData || []);

                // Get Videos
                const { data: videoData } = await supabase.from("course_videos").select("*").eq("course_id", courseData.id).order("sort_order");

                const videosWithUrls = await Promise.all((videoData || []).map(async (v) => {
                    const { data } = await supabase.storage.from("videodecurso").createSignedUrl(v.video_path, 3600);
                    return { ...v, url: data?.signedUrl };
                }));

                setVideos(videosWithUrls);
                setSelectedVideo(videosWithUrls[0] || null);

                // Get Progress
                const { data: progressData } = await supabase.from("video_progress").select("video_id, is_completed").eq("user_id", user?.id);
                const progressMap: Record<string, boolean> = {};
                progressData?.forEach(p => { progressMap[p.video_id] = p.is_completed || false; });
                setProgress(progressMap);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) init();
    }, [user, slug, getToken]);

    const handleLessonSelect = (video: Video) => {
        setSelectedVideo(video);
        if (videoRef.current) {
            videoRef.current.load();
        }
    };

    const markCompleted = async (videoId: string) => {
        if (!user) return;
        try {
            await supabase.from("video_progress").upsert({
                user_id: user.id,
                video_id: videoId,
                is_completed: true,
                updated_at: new Date().toISOString()
            }, { onConflict: "user_id,video_id" });
            setProgress(prev => ({ ...prev, [videoId]: true }));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="h-screen bg-background flex items-center justify-center animate-pulse text-muted-foreground">Cargando experiencia...</div>;

    return (
        <div className="h-screen flex flex-col bg-background overflow-hidden text-foreground">

            {/* Top Header - Sage Brand Color */}
            <header className="h-16 bg-sage text-white flex items-center justify-between px-4 shrink-0 shadow-sm border-b border-white/10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => navigate(-1)}>
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-sm font-medium truncate max-w-[400px] lg:max-w-none">
                        {course?.title}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => navigate('/aula-virtual')}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">

                {/* Sidebar - Left side as in photo */}
                <aside className="w-[300px] border-r border-border flex flex-col shrink-0 bg-background/50">
                    <div className="p-4 border-b bg-white">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contenido del curso</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <Accordion type="multiple" defaultValue={modules.map(m => m.id)} className="w-full">
                            {modules.map((module, idx) => {
                                const moduleVideos = videos.filter(v => v.module_id === module.id);
                                const completedCount = moduleVideos.filter(v => progress[v.id]).length;

                                return (
                                    <AccordionItem key={module.id} value={module.id} className="border-b-0">
                                        <AccordionTrigger className="px-4 py-3 hover:no-underline bg-background/50 hover:bg-background border-b border-border transition-colors">
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-foreground">{module.title}</p>
                                                <p className="text-[10px] text-muted-foreground font-bold uppercase">{completedCount}/{moduleVideos.length} LECCIONES</p>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="p-0 border-b bg-white">
                                            {moduleVideos.map((video) => (
                                                <button
                                                    key={video.id}
                                                    onClick={() => handleLessonSelect(video)}
                                                    className={cn(
                                                        "w-full flex items-center gap-3 px-6 py-3 text-left transition-all hover:bg-muted",
                                                        selectedVideo?.id === video.id ? "bg-primary/5 border-r-2 border-primary" : ""
                                                    )}
                                                >
                                                    {progress[video.id] ? (
                                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                                    ) : (
                                                        <Circle className="w-4 h-4 text-neutral-300 shrink-0" />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className={cn("text-xs font-medium", selectedVideo?.id === video.id ? "text-primary" : "text-muted-foreground")}>
                                                            {video.title}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Play className="w-3 h-3 text-neutral-300" />
                                                            <span className="text-[9px] font-bold text-neutral-300 uppercase italic">00:44</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col overflow-y-auto bg-background">

                    {/* Video Player Area */}
                    <div className="w-full aspect-video bg-black relative flex items-center justify-center">
                        {selectedVideo?.url ? (
                            <video
                                ref={videoRef}
                                src={selectedVideo.url}
                                controls
                                className="w-full h-full"
                                onEnded={() => markCompleted(selectedVideo.id)}
                            />
                        ) : (
                            <div className="text-white">Selecciona una lección</div>
                        )}
                    </div>

                    {/* Video Details & Interaction */}
                    <div className="max-w-4xl mx-auto w-full p-8 lg:p-12 space-y-12">

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold">{selectedVideo?.title}</h2>
                            <div className="flex items-center gap-4 border-t pt-8">
                                <Button variant="outline" className="rounded-full gap-2">
                                    <Share2 className="w-4 h-4" />
                                    Compartir
                                </Button>
                                <Button variant="outline" className="rounded-full gap-2">
                                    <Settings className="w-4 h-4" />
                                    Ajustes
                                </Button>
                            </div>
                        </div>

                        {/* Conversation / Comments as in photo */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    Participa en la conversación
                                </h3>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-neutral-100 shrink-0 border border-neutral-200"></div>
                                <div className="flex-1 space-y-4">
                                    <textarea
                                        className="w-full p-4 border rounded-xl bg-neutral-50 focus:ring-1 focus:ring-black outline-none min-h-[100px] text-sm"
                                        placeholder="Escribe tu comentario aquí..."
                                    />
                                    <div className="flex justify-end">
                                        <Button className="rounded-lg px-8 border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 font-medium">Enviar</Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Navigation Buttons */}
                        <div className="flex items-center justify-center gap-4 border-t border-border pt-12 pb-20">
                            <Button variant="ghost" className="bg-muted text-muted-foreground rounded-md px-6 text-[10px] font-bold uppercase tracking-wider gap-2 hover:bg-primary/10 hover:text-primary">
                                <ChevronLeft className="w-3 h-3" />
                                Anterior
                            </Button>
                            <Button variant="ghost" className="bg-muted text-muted-foreground rounded-md px-6 text-[10px] font-bold uppercase tracking-wider gap-2 hover:bg-primary/10 hover:text-primary">
                                Siguiente
                                <ChevronRight className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CoursePlayer;
