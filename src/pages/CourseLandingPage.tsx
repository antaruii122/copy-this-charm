import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Play, Users, Star, ArrowRight, ShieldCheck, Clock, Medal } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardFooter from "@/components/dashboard/DashboardFooter";
import { Tables } from "@/integrations/supabase/types";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from 'react-helmet-async';

interface Module {
    id: string;
    title: string;
    videos: { title: string; duration_seconds: number | null }[];
}

const CourseLandingPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { isSignedIn } = useAuth();
    const [course, setCourse] = useState<Tables<"courses"> | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const { data: courseData, error: courseError } = await supabase
                    .from("courses")
                    .select("*")
                    .eq("slug", slug)
                    .single();

                if (courseError) throw courseError;
                setCourse(courseData);

                const { data: moduleData, error: moduleError } = await supabase
                    .from("modules")
                    .select(`
            id,
            title,
            sort_order,
            course_videos (
              title,
              duration_seconds,
              sort_order
            )
          `)
                    .eq("course_id", courseData.id)
                    .order("sort_order", { ascending: true });

                if (moduleError) throw moduleError;

                const formattedModules = moduleData.map((m) => ({
                    id: m.id,
                    title: m.title,
                    videos: Array.isArray(m.course_videos)
                        ? m.course_videos.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                        : []
                }));

                setModules(formattedModules);
            } catch (error) {
                console.error("Error fetching course:", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchCourseData();
    }, [slug]);

    useEffect(() => {
        const checkEnrollment = async () => {
            if (!course || !isSignedIn) return;
            // Here we would check the enrollments table
            // For now, we'll just check if they are logged in as a placeholder 
            // and maybe if they have progress. 
            // Real implementation:
            /*
            const { data } = await supabase.from('enrollments')
               .select('*')
               .eq('user_id', user.id)
               .eq('course_id', course.id)
               .single();
           if (data) setIsEnrolled(true);
           */
        }
        checkEnrollment();
    }, [course, isSignedIn]);

    const handleEnroll = () => {
        if (!isSignedIn) {
            navigate("/auth");
            return;
        }

        if (isEnrolled) {
            navigate(`/aprender/${course?.slug}`);
            return;
        }

        // Logic for enrollment (Free or Payment)
        // For now, let's simulate a free enrollment -> go to player
        toast({
            title: "¡Inscripción Exitosa!",
            description: "Bienvenido al curso. Has sido inscrito correctamente.",
        });
        navigate(`/aprender/${course?.slug}`);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;
    if (!course) return <div className="min-h-screen flex items-center justify-center bg-white text-primary font-serif text-2xl uppercase tracking-widest">Curso no encontrado</div>;

    const courseSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": course.title,
        "description": course.description,
        "provider": {
            "@type": "Organization",
            "name": "NUTFEM",
            "sameAs": "https://nutfem.com"
        },
        "instructor": {
            "@type": "Person",
            "name": course.author_name || "Gabriela Suazo",
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-gold/30">
            <Helmet>
                <title>{course.title} | NUTFEM</title>
                <meta name="description" content={course.description || `Curso de ${course.title} en NUTFEM`} />
                <meta property="og:title" content={course.title} />
                <meta property="og:description" content={course.description || "Mejora tu salud con NUTFEM"} />
                <meta property="og:image" content={course.image_url || "/placeholder.svg"} />
                <meta property="og:type" content="website" />
                <script type="application/ld+json">
                    {JSON.stringify(courseSchema)}
                </script>
            </Helmet>
            <DashboardHeader />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 lg:px-20 bg-gradient-hero text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-neutral-900 to-transparent opacity-50"></div>
                <div className="container mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 border border-white/30 rounded-full">
                            <Star className="w-3.5 h-3.5 fill-white text-white" />
                            <span className="text-white text-[10px] font-bold tracking-[0.2em] uppercase">{course.rating || 5.0} Calificación del programa</span>
                        </div>
                        <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] uppercase">
                            {course.title}
                        </h1>
                        <p className="text-white/80 text-lg md:text-xl max-w-xl leading-relaxed">
                            {course.description}
                        </p>
                        <div className="flex flex-wrap gap-6 pt-4">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-white/80" />
                                <span className="text-sm font-medium text-white">Acceso de por vida</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Medal className="w-5 h-5 text-white/80" />
                                <span className="text-sm font-medium text-white">Certificado incluido</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                        <img
                            src={course.image_url || "/placeholder.svg"}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 transition-transform hover:scale-110 cursor-pointer">
                                <Play className="w-8 h-8 text-white fill-white ml-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Grid */}
            <section className="py-20 px-6 lg:px-20 container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Left Column: Details */}
                    <div className="lg:col-span-8 space-y-20">

                        {/* description */}
                        <div className="space-y-6">
                            <h2 className="font-serif text-3xl font-bold border-b border-border pb-4 uppercase tracking-widest">
                                Acerca de este curso
                            </h2>
                            <div className="prose prose-neutral max-w-none text-foreground leading-relaxed text-lg">
                                <RichTextEditor
                                    value={course.long_description || course.description || ""}
                                    readOnly={true}
                                    className="border-none px-0"
                                />
                            </div>
                        </div>

                        {/* outcomes */}
                        {course.learning_outcomes && Array.isArray(course.learning_outcomes) && course.learning_outcomes.length > 0 && (
                            <div className="bg-muted rounded-3xl p-10 space-y-8 border border-border">
                                <h2 className="font-serif text-3xl font-bold uppercase tracking-widest">
                                    ¿Qué aprenderás?
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {course.learning_outcomes.map((outcome: string, idx: number) => (
                                        <div key={idx} className="flex gap-4">
                                            <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                                            <p className="text-foreground font-medium leading-relaxed">{outcome}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* curriculum */}
                        <div className="space-y-10">
                            <div className="flex items-end justify-between border-b border-border pb-4">
                                <h2 className="font-serif text-3xl font-bold uppercase tracking-widest">
                                    Contenido del programa
                                </h2>
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                    {modules.length} Módulos • {modules.reduce((acc, m) => acc + m.videos.length, 0)} Lecciones
                                </p>
                            </div>

                            {modules.length === 0 ? (
                                <div className="bg-muted/30 rounded-2xl p-8 text-center border border-dashed border-border">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Clock className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="font-serif text-xl font-bold mb-2">Contenido en preparación</h3>
                                    <p className="text-muted-foreground">
                                        Estamos finalizando los detalles de este curso. ¡Vuelve pronto para ver las lecciones!
                                    </p>
                                </div>
                            ) : (
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    {modules.map((module, mIdx) => (
                                        <AccordionItem key={module.id} value={`module-${mIdx}`} className="border rounded-2xl px-6 bg-white overflow-hidden data-[state=open]:border-primary/30 transition-colors">
                                            <AccordionTrigger className="hover:no-underline py-6">
                                                <div className="flex items-center gap-4 text-left">
                                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-[10px] font-bold">
                                                        {mIdx + 1}
                                                    </span>
                                                    <span className="font-serif text-xl font-bold uppercase">{module.title}</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-6">
                                                <div className="space-y-2 pt-2">
                                                    {module.videos.map((video, vIdx) => (
                                                        <div key={vIdx} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted group transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <Play className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                                <span className="text-foreground font-medium">{video.title}</span>
                                                            </div>
                                                            {video.duration_seconds && (
                                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                                    {Math.floor(video.duration_seconds / 60)}:{(video.duration_seconds % 60).toString().padStart(2, '0')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            )}
                        </div>

                        {/* target audience */}
                        {course.target_audience && (
                            <div className="space-y-6">
                                <h2 className="font-serif text-3xl font-bold uppercase tracking-widest border-b border-primary/10 pb-4 text-foreground">
                                    ¿Para quién es este curso?
                                </h2>
                                <div className="bg-muted text-foreground rounded-3xl p-10 flex gap-8 items-start shadow-sm border border-border">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Medal className="w-6 h-6 text-primary" />
                                    </div>
                                    <p className="text-foreground text-lg leading-relaxed italic">
                                        {course.target_audience}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Pricing & Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="sticky top-32 p-10 rounded-[2.5rem] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] bg-white space-y-8">
                            <div className="space-y-2">
                                <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-[0.2em]">Inversión en tu salud</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="font-serif text-5xl font-bold">{course.price || "GRATIS"}</span>
                                    {course.price && <span className="text-muted-foreground font-medium uppercase text-sm">USD</span>}
                                </div>
                            </div>

                            <Button
                                className="w-full py-8 text-lg font-bold uppercase tracking-widest bg-gradient-primary text-white hover:opacity-90 rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                                onClick={handleEnroll}
                            >
                                {isEnrolled ? "Ir al Curso" : (isSignedIn ? "Inscribirse Ahora" : "Inicia Sesión para Inscribirte")}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>

                            <div className="space-y-4 pt-4">
                                <div className="flex items-center gap-3 text-sm text-foreground">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                    <span>Pago seguro y encriptado</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-neutral-600">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <span>Acceso inmediato tras compra</span>
                                </div>
                            </div>

                            <div className="border-t pt-8 space-y-6">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Impartido por</p>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={course.author_image_url || "/placeholder.svg"}
                                        alt={course.author_name || "Autor"}
                                        className="w-16 h-16 rounded-2xl object-cover bg-muted"
                                    />
                                    <div>
                                        <h4 className="font-serif text-lg font-bold uppercase">{course.author_name || "Gabriela Suazo"}</h4>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{course.author_role || "Instructora Ayurveda"}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            <DashboardFooter />
        </div>
    );
};

export default CourseLandingPage;
