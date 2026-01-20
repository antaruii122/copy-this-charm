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

interface Video {
    id: string;
    title: string;
    video_path: string;
    module_id: string | null;
    sort_order: number;
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

    const [course, setCourse] = useState<any>(null);
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
                fetchData();
            }
        };
        if (user) init();
    }, [user, slug]);

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

    if (loading) return <div className="h-screen bg-[#F8F9FA] flex items-center justify-center animate-pulse">Cargando experiencia...</div>;

    const LessonItem = ({ video }: { video: Video }) => (
        <button
            onClick={() => handleLessonSelect(video)}
            className={cn(
                "w-full flex items-center gap-3 px-6 py-4 text-left transition-all hover:bg-neutral-50 border-b border-neutral-50 last:border-0",
                selectedVideo?.id === video.id ? "bg-primary/5 border-l-4 border-l-primary" : ""
            )}
        >
            {progress[video.id] ? (
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
            ) : (
                <Circle className="w-4 h-4 text-neutral-300 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
                <p className={cn("text-xs font-bold uppercase tracking-wide", selectedVideo?.id === video.id ? "text-primary" : "text-neutral-500")}>
                    {video.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <Play className="w-3 h-3 text-neutral-300" />
                    <span className="text-[9px] font-bold text-neutral-300 uppercase italic">Lección</span>
                </div>
            </div>
        </button>
    );

    return (
        <div className="h-screen flex flex-col bg-white overflow-hidden text-neutral-800">

            {/* Top Header */}
            <header className="h-16 bg-[#2D3436] text-white flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => navigate(-1)}>
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-sm font-medium truncate max-w-[400px] lg:max-w-none">
                        {course?.title}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => navigate('/escritorio')}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">

                {/* Sidebar */}
                <aside className="w-[320px] border-r border-neutral-200 flex flex-col shrink-0 bg-[#F4F5F7]">
                    <div className="p-5 border-b bg-white">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Contenido del curso</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <Accordion type="multiple" defaultValue={["general", ...modules.map(m => m.id)]} className="w-full">

                            {/* General Section */}
                            {videos.some(v => !v.module_id) && (
                                <AccordionItem value="general" className="border-b-0">
                                    <AccordionTrigger className="px-5 py-4 hover:no-underline bg-white/50 hover:bg-white border-b transition-colors">
                                        <div className="text-left">
                                            <p className="text-xs font-bold text-neutral-700 uppercase tracking-widest">Lecciones Generales</p>
                                            <p className="text-[9px] text-neutral-400 font-bold uppercase mt-1">
                                                {videos.filter(v => !v.module_id).length} LECCIONES
                                            </p>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-0 border-b bg-white">
                                        {videos.filter(v => !v.module_id).map((video) => (
                                            <LessonItem key={video.id} video={video} />
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            )}

                            {/* Modules Sections */}
                            {modules.map((module) => {
                                const moduleVideos = videos.filter(v => v.module_id === module.id);
                                return (
                                    <AccordionItem key={module.id} value={module.id} className="border-b-0">
                                        <AccordionTrigger className="px-5 py-4 hover:no-underline bg-white/50 hover:bg-white border-b transition-colors">
                                            <div className="text-left">
                                                <p className="text-xs font-bold text-neutral-700 uppercase tracking-widest">{module.title}</p>
                                                <p className="text-[9px] text-neutral-400 font-bold uppercase mt-1">
                                                    {moduleVideos.length} LECCIONES
                                                </p>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="p-0 border-b bg-white">
                                            {moduleVideos.map((video) => (
                                                <LessonItem key={video.id} video={video} />
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-y-auto bg-white">
                    <div className="w-full aspect-video bg-black relative">
                        {selectedVideo?.url ? (
                            <video
                                key={selectedVideo.id}
                                ref={videoRef}
                                src={selectedVideo.url}
                                controls
                                className="w-full h-full"
                                onEnded={() => markCompleted(selectedVideo.id)}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-white/50 font-medium">
                                Selecciona una lección para comenzar
                            </div>
                        )}
                    </div>

                    <div className="max-w-4xl mx-auto w-full p-8 lg:p-16 space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-serif font-light text-neutral-900">{selectedVideo?.title}</h2>
                            <div className="flex items-center gap-4 border-t border-neutral-100 pt-8">
                                <Button variant="outline" className="rounded-full gap-2 border-neutral-200 text-neutral-500">
                                    <Share2 className="w-4 h-4" />
                                    Compartir
                                </Button>
                                <Button variant="outline" className="rounded-full gap-2 border-neutral-200 text-neutral-500">
                                    <Settings className="w-4 h-4" />
                                    Ajustes
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <h3 className="text-xl font-bold flex items-center gap-3 text-neutral-800">
                                <MessageSquare className="w-6 h-6 text-primary" />
                                Conversación de la lección
                            </h3>

                            <div className="flex gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-cream-dark/20 shrink-0 border border-cream-dark/30 flex items-center justify-center text-primary font-bold">
                                    {user?.firstName?.[0] || "U"}
                                </div>
                                <div className="flex-1 space-y-6">
                                    <textarea
                                        className="w-full p-6 border border-neutral-100 rounded-[2rem] bg-[#FAF9F6] focus:ring-1 focus:ring-primary outline-none min-h-[120px] text-sm leading-relaxed"
                                        placeholder="Comparte tus reflexiones o dudas..."
                                    />
                                    <div className="flex justify-end">
                                        <Button className="rounded-full px-10 py-6 bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-widest text-[10px]">Enviar Comentario</Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 border-t border-neutral-100 pt-16 pb-24">
                            <Button variant="ghost" className="bg-neutral-50 text-neutral-400 rounded-xl px-8 py-6 text-[10px] font-bold uppercase tracking-wider gap-2 hover:bg-neutral-100">
                                <ChevronLeft className="w-4 h-4" />
                                Lección Anterior
                            </Button>
                            <Button variant="ghost" className="bg-neutral-50 text-neutral-400 rounded-xl px-8 py-6 text-[10px] font-bold uppercase tracking-wider gap-2 hover:bg-neutral-100">
                                Siguiente Lección
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CoursePlayer;
