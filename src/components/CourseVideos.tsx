import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, ChevronRight, Clock, CheckCircle2, ArrowLeft, CheckCircle, Circle, PlayCircle, FileText, MessageSquare, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Video {
  id: string;
  name: string;
  title: string;
  duration?: string;
  thumbnail?: string;
  url?: string;
  module_id: string | null;
  sort_order: number;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
}

interface VideoProgress {
  video_id: string;
  is_completed: boolean;
  last_position_seconds: number;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  slug: string;
}

interface CourseVideosProps {
  courseId?: string;
}

const CourseVideos = ({ courseId }: CourseVideosProps) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [videos, setVideos] = useState<Video[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videoProgress, setVideoProgress] = useState<Record<string, VideoProgress>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (courseId) {
      fetchCourseAndVideos();
    } else {
      fetchAllVideos();
    }
  }, [courseId]);

  const fetchCourseAndVideos = async () => {
    try {
      // Fetch course by slug
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("slug", courseId)
        .maybeSingle();

      if (courseError) throw courseError;

      if (courseData) {
        setCourse(courseData);

        // Fetch modules for this course
        const { data: moduleData } = await supabase
          .from("modules")
          .select("*")
          .eq("course_id", courseData.id)
          .order("sort_order", { ascending: true });

        setModules(moduleData || []);

        // Fetch videos for this course
        const { data: courseVideos, error: videosError } = await supabase
          .from("course_videos")
          .select("*")
          .eq("course_id", courseData.id)
          .order("sort_order", { ascending: true });

        if (videosError) throw videosError;

        if (user) {
          // Fetch progress for this user
          const { data: progressData } = await supabase
            .from("video_progress")
            .select("*")
            .eq("user_id", user.id);

          if (progressData) {
            const progressMap: Record<string, VideoProgress> = {};
            progressData.forEach(p => {
              progressMap[p.video_id] = {
                video_id: p.video_id,
                is_completed: p.is_completed || false,
                last_position_seconds: p.last_position_seconds || 0
              };
            });
            setVideoProgress(progressMap);
          }
        }

        if (courseVideos && courseVideos.length > 0) {
          // Get signed URLs for each video
          const videosWithUrls = await Promise.all(
            courseVideos.map(async (video) => {
              const { data: urlData } = await supabase.storage
                .from("videodecurso")
                .createSignedUrl(video.video_path, 3600);

              return {
                id: video.id,
                name: video.video_path,
                title: video.title,
                url: urlData?.signedUrl || "",
                module_id: video.module_id,
                sort_order: video.sort_order || 0
              };
            })
          );

          setVideos(videosWithUrls);
          if (videosWithUrls.length > 0) {
            setSelectedVideo(videosWithUrls[0]);
          }
        } else {
          // Fallback: fetch from storage directly if no videos in database
          await fetchVideosFromStorage();
        }
      } else {
        // Course not found, show all videos
        await fetchVideosFromStorage();
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      await fetchVideosFromStorage();
    } finally {
      setLoading(false);
    }
  };

  const fetchAllVideos = async () => {
    await fetchVideosFromStorage();
    setLoading(false);
  };

  const fetchVideosFromStorage = async () => {
    try {
      const { data: files, error } = await supabase.storage
        .from("videodecurso")
        .list("", {
          limit: 100,
          sortBy: { column: "name", order: "asc" },
        });

      if (error) throw error;

      const videoFiles = files?.filter((file) =>
        file.name.toLowerCase().endsWith(".mp4")
      ) || [];

      const videosWithUrls = await Promise.all(
        videoFiles.map(async (file, index) => {
          const { data: urlData } = await supabase.storage
            .from("videodecurso")
            .createSignedUrl(file.name, 3600);

          return {
            id: file.id || `video-${index}`,
            name: file.name,
            title: file.name
              .replace(".mp4", "")
              .replace(".MP4", "")
              .replace(/_/g, " ")
              .replace(/-/g, " "),
            url: urlData?.signedUrl || "",
            module_id: null,
            sort_order: index
          };
        })
      );

      setVideos(videosWithUrls);
      if (videosWithUrls.length > 0) {
        setSelectedVideo(videosWithUrls[0]);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);
      setCurrentTime(formatTime(current));

      if (current / total > 0.9 && selectedVideo) {
        // Mark as completed if more than 90% watched
        if (!videoProgress[selectedVideo.id]?.is_completed) {
          markAsCompleted(selectedVideo.id, true);
        }
      }

      // Update last position (throttled/debounced logic could go here)
      // For now we'll just update state, and save to DB on specific events
    }
  };

  const markAsCompleted = async (videoId: string, completed: boolean = true) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("video_progress")
        .upsert({
          user_id: user.id,
          video_id: videoId,
          is_completed: completed,
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id,video_id" });

      if (error) throw error;

      setVideoProgress(prev => ({
        ...prev,
        [videoId]: {
          ...(prev[videoId] || { video_id: videoId, last_position_seconds: 0 }),
          is_completed: completed
        }
      }));

      if (completed) {
        toast({
          title: "¡Lección completada!",
          description: "Tu progreso ha sido guardado.",
        });
      }
    } catch (error) {
      console.error("Error marking as completed:", error);
    }
  };

  const updateVideoPosition = async (videoId: string, position: number) => {
    if (!user) return;
    try {
      await supabase
        .from("video_progress")
        .upsert({
          user_id: user.id,
          video_id: videoId,
          last_position_seconds: position,
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id,video_id" });
    } catch (error) {
      console.error("Error updating position:", error);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(formatTime(videoRef.current.duration));
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = clickPosition * videoRef.current.duration;
    }
  };

  const selectVideo = (video: Video) => {
    setSelectedVideo(video);
    setIsPlaying(false);
    setProgress(0);

    // Resume from last position if exists
    const lastPos = videoProgress[video.id]?.last_position_seconds || 0;
    if (videoRef.current) {
      videoRef.current.currentTime = lastPos;
    }
    setCurrentTime(formatTime(lastPos));
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20" />
            <p className="text-muted-foreground">Cargando videos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="mb-8">
        {courseId && (
          <Link
            to="/aula-virtual"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Mis Cursos
          </Link>
        )}
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          {course?.title || "Mis Cursos"}
        </h1>
        <p className="text-muted-foreground">
          {course?.description || "Tus programas y recursos de aprendizaje"}
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Video Player - Main Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video group border border-white/5">
            {selectedVideo?.url ? (
              <>
                <video
                  ref={videoRef}
                  src={selectedVideo.url}
                  className="w-full h-full object-contain"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => {
                    setIsPlaying(false);
                    if (selectedVideo) {
                      markAsCompleted(selectedVideo.id, true);
                    }
                  }}
                />

                {/* Play/Pause Overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/0 hover:bg-black/10 transition-colors"
                  onClick={togglePlay}
                >
                  {!isPlaying && (
                    <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform backdrop-blur-sm">
                      <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                    </div>
                  )}
                </div>

                {/* Controls Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Progress Bar */}
                  <div
                    className="h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer group/progress overflow-hidden"
                    onClick={handleProgressClick}
                  >
                    <div
                      className="h-full bg-primary rounded-full relative transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button onClick={togglePlay} className="text-white hover:text-primary transition-colors">
                        {isPlaying ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6" fill="currentColor" />}
                      </button>
                      <button onClick={toggleMute} className="text-white hover:text-primary transition-colors">
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                      </button>
                      <span className="text-white text-sm font-medium font-mono">
                        {currentTime} / {duration}
                      </span>
                    </div>
                    <button onClick={handleFullscreen} className="text-white hover:text-primary transition-colors">
                      <Maximize className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
                <PlayCircle className="w-16 h-16 opacity-20" />
                <p>Selecciona una lección para comenzar</p>
              </div>
            )}
          </div>

          <Tabs defaultValue="lessons" className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 mb-6">
              <TabsTrigger
                value="lessons"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Contenido
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Notas
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Recursos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lessons" className="mt-0">
              <div className="bg-card border rounded-xl overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{selectedVideo?.title || "Detalles de la Lección"}</h2>
                  <p className="text-muted-foreground">{selectedVideo?.name ? "Esta lección forma parte del programa oficial." : "Selecciona una lección para ver su descripción."}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-0">
              <div className="bg-card border rounded-xl p-8 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-2">Tus Notas Personales</h3>
                <p className="text-muted-foreground mb-4">Próximamente: Podrás guardar notas privadas sincronizadas con el segundo exacto del video.</p>
                <Button variant="outline" disabled>Empezar a escribir</Button>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="mt-0">
              <div className="bg-card border rounded-xl p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-2">Recursos Descargables</h3>
                <p className="text-muted-foreground mb-4">No hay recursos adicionales adjuntos a esta lección.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b bg-muted/30">
              <h4 className="font-bold text-foreground mb-1 flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Contenido del Programa
              </h4>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{videos.length} lecciones</span>
                <span className="text-primary font-medium">
                  {Math.round((Object.values(videoProgress).filter(p => p.is_completed).length / (videos.length || 1)) * 100)}% completado
                </span>
              </div>
            </div>

            <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
              {modules.length === 0 ? (
                <div className="p-4 space-y-2">
                  {videos.map((video, idx) => (
                    <LessonItem
                      key={video.id}
                      video={video}
                      isSelected={selectedVideo?.id === video.id}
                      isCompleted={videoProgress[video.id]?.is_completed}
                      onSelect={() => selectVideo(video)}
                    />
                  ))}
                </div>
              ) : (
                <Accordion type="multiple" defaultValue={[modules[0].id]} className="w-full">
                  {modules.map((module) => {
                    const moduleVideos = videos.filter(v => v.module_id === module.id);
                    const completedInModule = moduleVideos.filter(v => videoProgress[v.id]?.is_completed).length;

                    return (
                      <AccordionItem key={module.id} value={module.id} className="border-b">
                        <AccordionTrigger className="hover:no-underline px-6 py-4 hover:bg-muted/50 transition-colors">
                          <div className="text-left">
                            <p className="font-semibold text-sm">{module.title}</p>
                            <p className="text-[10px] text-muted-foreground font-normal">
                              {completedInModule} / {moduleVideos.length} completado
                            </p>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-0">
                          <div className="p-2 bg-muted/10 space-y-1">
                            {moduleVideos.map((video) => (
                              <LessonItem
                                key={video.id}
                                video={video}
                                isSelected={selectedVideo?.id === video.id}
                                isCompleted={videoProgress[video.id]?.is_completed}
                                onSelect={() => selectVideo(video)}
                              />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}

                  {/* Handle videos without modules */}
                  {videos.filter(v => !v.module_id).length > 0 && (
                    <AccordionItem value="unassigned" className="border-b">
                      <AccordionTrigger className="hover:no-underline px-6 py-4 hover:bg-muted/50 transition-colors">
                        <div className="text-left">
                          <p className="font-semibold text-sm">Contenido Adicional</p>
                          <p className="text-[10px] text-muted-foreground font-normal">
                            Videos pendientes de categorizar
                          </p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-0">
                        <div className="p-2 bg-muted/10 space-y-1">
                          {videos.filter(v => !v.module_id).map((video) => (
                            <LessonItem
                              key={video.id}
                              video={video}
                              isSelected={selectedVideo?.id === video.id}
                              isCompleted={videoProgress[video.id]?.is_completed}
                              onSelect={() => selectVideo(video)}
                            />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LessonItem = ({
  video,
  isSelected,
  isCompleted,
  onSelect
}: {
  video: Video,
  isSelected: boolean,
  isCompleted?: boolean,
  onSelect: () => void
}) => (
  <button
    onClick={onSelect}
    className={cn(
      "w-full p-3 flex items-center gap-3 rounded-lg transition-all text-left group",
      isSelected ? "bg-primary/10 border-l-2 border-primary" : "hover:bg-muted"
    )}
  >
    <div className="flex-shrink-0">
      {isCompleted ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <Circle className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className={cn(
        "text-sm font-medium line-clamp-1",
        isSelected ? "text-primary" : "text-foreground"
      )}>
        {video.title}
      </p>
    </div>
    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
  </button>
);

export default CourseVideos;
