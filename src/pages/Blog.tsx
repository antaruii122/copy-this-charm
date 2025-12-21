import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, User, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  author_name: string | null;
  published: boolean | null;
  created_at: string;
  updated_at: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("published", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Blog de Nutrición Femenina - NUTFEM",
    "description": "Artículos sobre nutrición femenina, hormonas, ciclo menstrual y fertilidad para una vida plena.",
    "url": "https://nutfem.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "NUTFEM",
      "logo": {
        "@type": "ImageObject",
        "url": "https://nutfem.com/logo.png"
      }
    },
    "blogPost": posts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "author": {
        "@type": "Person",
        "name": post.author_name || "NUTFEM"
      },
      "datePublished": post.created_at,
      "image": post.cover_image
    }))
  };

  return (
    <>
      <Helmet>
        <title>Blog de Nutrición Femenina | NUTFEM - Hormonas y Ciclo Menstrual</title>
        <meta name="description" content="Descubre artículos sobre nutrición femenina, equilibrio hormonal, ciclo menstrual y fertilidad. Consejos prácticos para una vida más saludable." />
        <meta name="keywords" content="nutrición femenina, hormonas, ciclo menstrual, fertilidad, menopausia, salud mujer, wellness" />
        <link rel="canonical" href="https://nutfem.com/blog" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Blog de Nutrición Femenina | NUTFEM" />
        <meta property="og:description" content="Artículos sobre nutrición femenina, hormonas y ciclo menstrual para transformar tu salud." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nutfem.com/blog" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog de Nutrición Femenina | NUTFEM" />
        <meta name="twitter:description" content="Artículos sobre nutrición femenina, hormonas y ciclo menstrual." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 md:py-24 pt-24 md:pt-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
                Blog de <span className="text-primary">Nutrición Femenina</span>
              </h1>
              <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
                Artículos, guías y consejos prácticos sobre nutrición hormonal, 
                ciclo menstrual y fertilidad para mujeres conscientes.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-12 md:py-16" aria-labelledby="articles-heading">
          <div className="container mx-auto px-4">
            <h2 id="articles-heading" className="sr-only">Artículos recientes</h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  Próximamente publicaremos artículos sobre nutrición femenina.
                </p>
                <p className="text-muted-foreground mt-2">
                  ¡Vuelve pronto!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article 
                    key={post.id} 
                    className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-border"
                    itemScope 
                    itemType="https://schema.org/BlogPosting"
                  >
                    <Link to={`/blog/${post.slug}`} className="block">
                      <div className="aspect-video overflow-hidden bg-muted">
                        {post.cover_image ? (
                          <img 
                            src={post.cover_image} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            itemProp="image"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10">
                            <span className="text-4xl">📝</span>
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock size={12} />
                          {calculateReadTime(post.content)}
                        </span>
                      </div>
                      
                      <Link to={`/blog/${post.slug}`}>
                        <h3 
                          className="font-serif text-xl text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2"
                          itemProp="headline"
                        >
                          {post.title}
                        </h3>
                      </Link>
                      
                      {post.excerpt && (
                        <p 
                          className="text-foreground/70 text-sm mb-4 line-clamp-3"
                          itemProp="description"
                        >
                          {post.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1" itemProp="author">
                            <User size={12} />
                            {post.author_name || "NUTFEM"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            <time itemProp="datePublished">{formatDate(post.created_at)}</time>
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="bg-primary/5 py-16" aria-labelledby="newsletter-heading">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 id="newsletter-heading" className="font-serif text-3xl text-foreground mb-4">
                Recibe contenido exclusivo
              </h2>
              <p className="text-foreground/70 mb-6">
                Suscríbete a nuestra newsletter y recibe artículos, tips y recursos 
                gratuitos sobre nutrición femenina directamente en tu correo.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <label htmlFor="newsletter-email" className="sr-only">Tu correo electrónico</label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
                <button 
                  type="submit"
                  className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Suscribirme
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Blog;
