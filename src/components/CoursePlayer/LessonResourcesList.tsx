import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileText, Download, ExternalLink, Paperclip } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type LessonResource = Tables<"lesson_resources">;

interface LessonResourcesListProps {
    videoId: string;
}

const LessonResourcesList = ({ videoId }: LessonResourcesListProps) => {
    const [resources, setResources] = useState<LessonResource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("lesson_resources")
                    .select("*")
                    .eq("video_id", videoId)
                    .order("created_at", { ascending: true });

                if (error) throw error;
                setResources(data || []);
            } catch (error) {
                console.error("Error fetching resources:", error);
            } finally {
                setLoading(false);
            }
        };

        if (videoId) fetchResources();
    }, [videoId]);

    const handleDownload = (url: string) => {
        window.open(url, '_blank');
    };

    if (loading) return <div className="text-sm text-muted-foreground animate-pulse">Cargando recursos...</div>;

    if (resources.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-2 bg-muted/30 rounded-lg border border-dashed">
                <Paperclip className="w-10 h-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No hay recursos adjuntos para esta lección.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resources.map((resource) => (
                <div
                    key={resource.id}
                    className="flex items-center justify-between p-4 bg-card hover:bg-muted/50 transition-colors border rounded-xl group"
                >
                    <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                            <h4 className="font-medium text-sm truncate pr-2" title={resource.title}>
                                {resource.title}
                            </h4>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                {resource.resource_type || "ARCHIVO"}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => handleDownload(resource.file_url)}
                    >
                        <Download className="w-4 h-4" />
                    </Button>
                </div>
            ))}
        </div>
    );
};

export default LessonResourcesList;
