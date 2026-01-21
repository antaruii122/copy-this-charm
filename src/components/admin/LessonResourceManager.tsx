import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, FileText, Download, Plus, Paperclip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

type LessonResource = Tables<"lesson_resources">;

interface LessonResourceManagerProps {
    videoId: string;
}

const LessonResourceManager = ({ videoId }: LessonResourceManagerProps) => {
    const [resources, setResources] = useState<LessonResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [newResourceTitle, setNewResourceTitle] = useState("");
    const { toast } = useToast();

    const fetchResources = async () => {
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

    useEffect(() => {
        fetchResources();
    }, [videoId]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!newResourceTitle.trim()) {
            toast({
                title: "Falta el título",
                description: "Por favor escribe un título para el recurso antes de subirlo.",
                variant: "destructive",
            });
            return;
        }

        try {
            setUploading(true);
            const fileExt = file.name.split(".").pop();
            const fileName = `${videoId}/${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from("course-resources")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from("course-resources")
                .getPublicUrl(filePath);

            // Save to DB
            const { error: dbError } = await supabase
                .from("lesson_resources")
                .insert({
                    video_id: videoId,
                    title: newResourceTitle,
                    file_url: publicUrl,
                    resource_type: fileExt || "file",
                });

            if (dbError) throw dbError;

            toast({
                title: "Recurso añadido",
                description: "El archivo se ha subido correctamente.",
            });

            setNewResourceTitle("");
            fetchResources();
        } catch (error: any) {
            toast({
                title: "Error al subir",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string, fileUrl: string) => {
        try {
            // Optimistic update
            setResources(resources.filter(r => r.id !== id));

            // Extract file path from URL logic roughly (or we can just delete from DB and leave file for now to save logic complexity, 
            // but for proper cleanup we should delete file. 
            // URL: https://.../storage/v1/object/public/course-resources/VIDEOID/FILE)
            // It's safer to just delete DB record for MVP to avoid deleting shared files if logic is wrong.
            // But let's try to delete DB row.

            const { error } = await supabase
                .from("lesson_resources")
                .delete()
                .eq("id", id);

            if (error) throw error;

            toast({ title: "Recurso eliminado" });
        } catch (error) {
            console.error("Error deleting resource:", error);
            fetchResources(); // Revert on error
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold text-lg">Materiales Adjuntos</h3>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg border space-y-4">
                <div className="flex gap-2 items-end">
                    <div className="flex-1 space-y-2">
                        <Label>Título del Archivo</Label>
                        <Input
                            placeholder="Ej: Guía PDF, Hoja de Trabajo..."
                            value={newResourceTitle}
                            onChange={(e) => setNewResourceTitle(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleFileUpload}
                            disabled={uploading}
                        />
                        <Button disabled={uploading} className="w-full">
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                            Subir Archivo
                        </Button>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                {resources.map((resource) => (
                    <div key={resource.id} className="flex items-center justify-between p-3 bg-white border rounded-md shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">{resource.title}</p>
                                <p className="text-xs text-muted-foreground uppercase">{resource.resource_type}</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(resource.id, resource.file_url)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
                {!loading && resources.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground text-sm italic">
                        No hay materiales adjuntos en esta lección.
                    </div>
                )}
            </div>
        </div>
    );
};

export default LessonResourceManager;
