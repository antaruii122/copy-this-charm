import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Play, Users, Star, ArrowRight, ShieldCheck, Clock, Medal } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardFooter from "@/components/dashboard/DashboardFooter";

interface Course {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    long_description: string | null;
    price: string | null;
    image_url: string | null;
    learning_outcomes: string[] | any;
    target_audience: string | null;
    author_name: string | null;
    author_role: string | null;
    author_image_url: string | null;
    rating: number | null;
}

interface Module {
    id: string;
    title: string;
    videos: { title: string; duration_seconds: number | null }[];
}

const CourseLandingPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { isSignedIn } = useAuth();
    const [course, setCourse] = useState<Course | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const { data: courseData, error: courseError } = await supabase
                    .from("courses")
                    .select("*")
                    .eq("slug", slug)
                    .single();

                if (courseError) throw courseError;
                setCourse(courseData as any);

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

                const formattedModules = moduleData.map((m: any) => ({
                    id: m.id,
                    title: m.title,
                    videos: (m.course_videos || []).sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
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

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;
    if (!course) return <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB] text-neutral-800 font-serif text-2xl uppercase tracking-widest">Curso no encontrado</div>;

    return (
        <div className="min-h-screen bg-[#FDFCFB] text-neutral-800 selection:bg-rose-100">
            <DashboardHeader />

            {/* Hero Section - Softer, not black */}
            <section className="relative pt-40 pb-20 px-6 lg:px-20 bg-[#FAF9F6]">
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1 bg-white border border-neutral-200 rounded-full shadow-sm">
                            <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                            <span className="text-neutral-500 text-[10px] font-bold tracking-[0.2em] uppercase">Inscripción Abierta</span>
                        </div>
                        <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight leading-[1.1] text-neutral-900">
                            {course.title}
                        </h1>
                        <p className="text-neutral-600 text-lg md:text-xl max-w-xl leading-relaxed">
                            {course.description}
                        </p>
                        <div className="flex flex-wrap gap-8 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-cream-dark/20 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-primary" />
                                </div>
                                <span className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Acceso de por vida</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-cream-dark/20 flex items-center justify-center">
                                    <Medal className="w-5 h-5 text-primary" />
                                </div>
                                <span className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Certificado</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl group">
                        <img
                            src={course.image_url || "/placeholder.svg"}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/40">
                                <Play className="w-8 h-8 text-white fill-white ml-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Grid */}
            <section className="py-24 px-6 lg:px-20 container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

                    {/* Left Column: Details */}
                    <div className="lg:col-span-8 space-y-24">

                        {/* description */}
                        <div className="space-y-8">
                            <h2 className="font-serif text-4xl font-light text-neutral-900 border-b border-neutral-100 pb-6 uppercase tracking-widest">
                                Acerca de este curso
                            </h2>
                            <div className="prose prose-neutral max-w-none text-neutral-600 leading-relaxed text-lg font-light">
                                {course.long_description || course.description}
                            </div>
                        </div>

                        {/* outcomes */}
                        {course.learning_outcomes && Array.isArray(course.learning_outcomes) && course.learning_outcomes.length > 0 && (
                            <div className="bg-sage-light/20 rounded-[3rem] p-12 space-y-10 border border-sage-light/30">
                                <h2 className="font-serif text-4xl font-light text-neutral-900 uppercase tracking-widest">
                                    ¿Qué aprenderás?
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {course.learning_outcomes.map((outcome: string, idx: number) => (
                                        <div key={idx} className="flex gap-4">
                                            <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                                            <p className="text-neutral-700 font-medium leading-relaxed">{outcome}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* curriculum */}
                        <div className="space-y-12">
                            <div className="flex items-baseline justify-between border-b border-neutral-100 pb-6">
                                <h2 className="font-serif text-4xl font-light text-neutral-900 uppercase tracking-widest">
                                    Contenido del programa
                                </h2>
                                <p className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em]">
                                    {modules.length} Módulos • {modules.reduce((acc, m) => acc + (m.videos ? m.videos.length : 0), 0)} Lecciones
                                </p>
                            </div>

                            <Accordion type="single" collapsible className="w-full space-y-6">
                                {modules.map((module, mIdx) => (
                                    <AccordionItem key={module.id} value={`module-${mIdx}`} className="border rounded-[2rem] px-8 bg-white overflow-hidden data-[state=open]:border-primary/30 data-[state=open]:shadow-xl transition-all">
                                        <AccordionTrigger className="hover:no-underline py-8">
                                            <div className="flex items-center gap-6 text-left">
                                                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-50 text-neutral-400 text-xs font-bold border border-neutral-100">
                                                    {mIdx + 1}
                                                </span>
                                                <span className="font-serif text-2xl font-light text-neutral-900 uppercase tracking-wide">{module.title}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-8">
                                            <div className="space-y-3 pt-4 border-t border-neutral-50">
                                                {module.videos && module.videos.map((video, vIdx) => (
                                                    <div key={vIdx} className="flex items-center justify-between p-4 rounded-2xl hover:bg-neutral-50 group transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            <Play className="w-4 h-4 text-neutral-300 group-hover:text-primary transition-colors" />
                                                            <span className="text-neutral-600 font-medium text-sm">{video.title}</span>
                                                        </div>
                                                        {video.duration_seconds && (
                                                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
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
                        </div>

                        {/* target audience */}
                        {course.target_audience && (
                            <div className="space-y-8">
                                <h2 className="font-serif text-4xl font-light text-neutral-900 uppercase tracking-widest border-b border-neutral-100 pb-6">
                                    ¿Para quién es este curso?
                                </h2>
                                <div className="bg-neutral-900 text-white rounded-[3rem] p-12 flex gap-10 items-start shadow-2xl overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16"></div>
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/10">
                                        <Users className="w-8 h-8 text-white" />
                                    </div>
                                    <p className="text-neutral-300 text-xl leading-relaxed italic font-light">
                                        {course.target_audience}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Pricing & Sidebar */}
                    <div className="lg:col-span-4 space-y-10">
                        <Card className="sticky top-32 p-12 rounded-[3.5rem] border-none shadow-[0_48px_96px_-16px_rgba(0,0,0,0.08)] bg-white space-y-10 overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-rose-300 to-gold/50"></div>

                            <div className="space-y-3">
                                <span className="text-neutral-400 font-bold text-[10px] uppercase tracking-[0.3em]">Tu inversión en bienestar</span>
                                <div className="flex items-baseline gap-3">
                                    <span className="font-serif text-6xl font-light text-neutral-900">{course.price || "GRATIS"}</span>
                                    {course.price && <span className="text-neutral-400 font-bold uppercase text-xs tracking-widest">USD</span>}
                                </div>
                            </div>

                            <Button
                                className="w-full py-10 text-sm font-bold uppercase tracking-[0.2em] bg-black text-white hover:bg-neutral-800 rounded-3xl shadow-xl transition-all hover:scale-[1.02]"
                                onClick={() => isSignedIn ? navigate(`/aprender/${course.slug}`) : navigate('/auth')}
                            >
                                {isSignedIn ? "Ver Programa" : "Inscribirse Ahora"}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>

                            <div className="space-y-6 pt-4">
                                <div className="flex items-center gap-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                    <span>Pago seguro encriptado</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <span>Acceso inmediato</span>
                                </div>
                            </div>

                            <div className="border-t border-neutral-100 pt-10 space-y-8">
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em]">Impartido por</p>
                                <div className="flex items-center gap-6">
                                    <img
                                        src={course.author_image_url || "/placeholder.svg"}
                                        alt={course.author_name || "Autor"}
                                        className="w-20 h-20 rounded-[2rem] object-cover bg-neutral-100 shadow-lg border-4 border-white"
                                    />
                                    <div className="space-y-1">
                                        <h4 className="font-serif text-xl font-light text-neutral-900 uppercase tracking-wide">{course.author_name || "Gabriela Suazo"}</h4>
                                        <p className="text-[10px] text-primary font-bold uppercase tracking-wider">{course.author_role || "Instructora Ayurveda"}</p>
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
