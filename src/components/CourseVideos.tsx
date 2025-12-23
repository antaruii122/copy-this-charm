import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, ChevronRight, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Video {
  id: string;
  name: string;
  title: string;
  duration?: string;
  thumbnail?: string;
  url?: string;
}

const CourseVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
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
          };
        })
      );

      setVideos(videosWithUrls);
      if (videosWithUrls.length > 0) {
        setSelectedVideo(videosWithUrls[0]);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
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
        setWatchedVideos((prev) => new Set(prev).add(selectedVideo.id));
      }
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
    setCurrentTime("0:00");
  };

  if (loading) {
    return (
      <section className="py-20 md:py-32 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20" />
              <p className="text-muted-foreground">Cargando videos...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="programas" className="py-20 md:py-32 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
            Cursos & Recursos
          </h2>
          <p className="text-muted-foreground text-lg">
            Programas diseñados para acompañarte en cada etapa de tu vida hormonal
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Video Player - Main Area */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative bg-foreground/95 rounded-2xl overflow-hidden shadow-card aspect-video group">
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
                        setWatchedVideos((prev) => new Set(prev).add(selectedVideo.id));
                      }
                    }}
                  />

                  {/* Play/Pause Overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/0 hover:bg-black/10 transition-colors"
                    onClick={togglePlay}
                  >
                    {!isPlaying && (
                      <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                        <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                      </div>
                    )}
                  </div>

                  {/* Controls Bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Progress Bar */}
                    <div
                      className="h-1 bg-white/30 rounded-full mb-4 cursor-pointer group/progress"
                      onClick={handleProgressClick}
                    >
                      <div
                        className="h-full bg-primary rounded-full relative transition-all"
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={togglePlay}
                          className="w-10 h-10 flex items-center justify-center text-white hover:text-primary transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5" fill="currentColor" />
                          ) : (
                            <Play className="w-5 h-5" fill="currentColor" />
                          )}
                        </button>
                        <button
                          onClick={toggleMute}
                          className="w-10 h-10 flex items-center justify-center text-white hover:text-primary transition-colors"
                        >
                          {isMuted ? (
                            <VolumeX className="w-5 h-5" />
                          ) : (
                            <Volume2 className="w-5 h-5" />
                          )}
                        </button>
                        <span className="text-white text-sm font-medium">
                          {currentTime} / {duration}
                        </span>
                      </div>
                      <button
                        onClick={handleFullscreen}
                        className="w-10 h-10 flex items-center justify-center text-white hover:text-primary transition-colors"
                      >
                        <Maximize className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <p>Selecciona un video para reproducir</p>
                </div>
              )}
            </div>

            {/* Video Title & Info */}
            {selectedVideo && (
              <div className="bg-background rounded-xl p-6 shadow-soft">
                <h3 className="font-serif text-xl md:text-2xl text-foreground mb-2">
                  {selectedVideo.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {duration !== "0:00" ? duration : "Cargando..."}
                  </span>
                  {watchedVideos.has(selectedVideo.id) && (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      Completado
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Video Playlist */}
          <div className="lg:col-span-1">
            <div className="bg-background rounded-2xl shadow-soft overflow-hidden">
              <div className="p-4 border-b border-border">
                <h4 className="font-semibold text-foreground">
                  Lista de Videos
                </h4>
                <p className="text-sm text-muted-foreground">
                  {videos.length} videos • {watchedVideos.size} completados
                </p>
              </div>

              <div className="max-h-[500px] overflow-y-auto">
                {videos.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>No hay videos disponibles</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-border">
                    {videos.map((video, index) => (
                      <li key={video.id}>
                        <button
                          onClick={() => selectVideo(video)}
                          className={cn(
                            "w-full p-4 flex items-start gap-3 hover:bg-accent/50 transition-colors text-left",
                            selectedVideo?.id === video.id && "bg-accent"
                          )}
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                            {watchedVideos.has(video.id) ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "font-medium text-sm line-clamp-2",
                                selectedVideo?.id === video.id
                                  ? "text-primary"
                                  : "text-foreground"
                              )}
                            >
                              {video.title}
                            </p>
                          </div>
                          {selectedVideo?.id === video.id && (
                            <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Course Progress Card */}
            <div className="mt-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
              <h4 className="font-semibold text-foreground mb-2">Tu Progreso</h4>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{
                      width: `${videos.length > 0 ? (watchedVideos.size / videos.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {videos.length > 0
                    ? Math.round((watchedVideos.size / videos.length) * 100)
                    : 0}
                  %
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {watchedVideos.size} de {videos.length} videos completados
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
          >
            Ver todos los programas
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CourseVideos;
