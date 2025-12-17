import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Los 5 pilares de la salud integrativa para una vida plena",
    excerpt: "Descubre cómo la alimentación consciente, el movimiento, el descanso, la gestión emocional y la conexión espiritual pueden transformar tu bienestar.",
    author: "Dra. María García",
    date: "15 Dic 2025",
    readTime: "8 min",
    category: "Bienestar",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    slug: "pilares-salud-integrativa"
  },
  {
    id: "2",
    title: "Meditación para principiantes: Guía completa paso a paso",
    excerpt: "Aprende técnicas de meditación sencillas que puedes practicar desde hoy para reducir el estrés y mejorar tu concentración.",
    author: "Dra. María García",
    date: "10 Dic 2025",
    readTime: "12 min",
    category: "Meditación",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    slug: "meditacion-principiantes-guia"
  },
  {
    id: "3",
    title: "Alimentación consciente: Más allá de las dietas",
    excerpt: "La alimentación consciente no es una dieta más, es una forma de relacionarte con la comida que transforma tu salud física y emocional.",
    author: "Dra. María García",
    date: "5 Dic 2025",
    readTime: "10 min",
    category: "Nutrición",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
    slug: "alimentacion-consciente"
  },
  {
    id: "4",
    title: "Cómo el yoga puede mejorar tu salud mental",
    excerpt: "Estudios científicos demuestran los beneficios del yoga para reducir la ansiedad, la depresión y mejorar el bienestar general.",
    author: "Dra. María García",
    date: "1 Dic 2025",
    readTime: "7 min",
    category: "Yoga",
    image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&q=80",
    slug: "yoga-salud-mental"
  },
  {
    id: "5",
    title: "Técnicas de respiración para controlar el estrés",
    excerpt: "Aprende ejercicios de respiración que puedes usar en cualquier momento para calmar tu sistema nervioso y recuperar la calma.",
    author: "Dra. María García",
    date: "25 Nov 2025",
    readTime: "6 min",
    category: "Bienestar",
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&q=80",
    slug: "tecnicas-respiracion-estres"
  },
  {
    id: "6",
    title: "El poder del descanso: Mejora tu sueño naturalmente",
    excerpt: "Descubre rituales nocturnos y hábitos saludables para mejorar la calidad de tu sueño sin medicamentos.",
    author: "Dra. María García",
    date: "20 Nov 2025",
    readTime: "9 min",
    category: "Descanso",
    image: "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=800&q=80",
    slug: "mejorar-sueno-naturalmente"
  }
];

const categories = ["Todos", "Bienestar", "Meditación", "Nutrición", "Yoga", "Descanso"];

const Blog = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Blog de Salud Integrativa - SomaIntegra",
    "description": "Artículos sobre bienestar, meditación, nutrición consciente y salud holística para una vida plena.",
    "url": "https://somaintegra.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "SomaIntegra",
      "logo": {
        "@type": "ImageObject",
        "url": "https://somaintegra.com/logo.png"
      }
    },
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "datePublished": post.date,
      "image": post.image
    }))
  };

  return (
    <>
      <Helmet>
        <title>Blog de Salud Integrativa | SomaIntegra - Bienestar y Vida Plena</title>
        <meta name="description" content="Descubre artículos sobre salud integrativa, meditación, nutrición consciente, yoga y bienestar holístico. Consejos prácticos para una vida más saludable." />
        <meta name="keywords" content="salud integrativa, bienestar, meditación, nutrición consciente, yoga, mindfulness, vida saludable, wellness" />
        <link rel="canonical" href="https://somaintegra.com/blog" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Blog de Salud Integrativa | SomaIntegra" />
        <meta property="og:description" content="Artículos sobre bienestar, meditación, nutrición y salud holística para transformar tu vida." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://somaintegra.com/blog" />
        <meta property="og:image" content="https://somaintegra.com/blog-og-image.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog de Salud Integrativa | SomaIntegra" />
        <meta name="twitter:description" content="Artículos sobre bienestar, meditación, nutrición y salud holística." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-sage/10 via-cream to-sage/5 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
                Blog de <span className="text-sage">Bienestar</span>
              </h1>
              <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
                Artículos, guías y consejos prácticos para cultivar una vida más saludable, 
                consciente y plena desde la perspectiva de la salud integrativa.
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <nav className="border-b border-border bg-white sticky top-0 z-10" aria-label="Categorías del blog">
          <div className="container mx-auto px-4">
            <ul className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                      category === "Todos"
                        ? "bg-sage text-white"
                        : "bg-muted text-foreground/70 hover:bg-sage/10 hover:text-sage"
                    }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Blog Posts Grid */}
        <section className="py-12 md:py-16" aria-labelledby="articles-heading">
          <div className="container mx-auto px-4">
            <h2 id="articles-heading" className="sr-only">Artículos recientes</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article 
                  key={post.id} 
                  className="bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-card transition-shadow group"
                  itemScope 
                  itemType="https://schema.org/BlogPosting"
                >
                  <Link to={`/blog/${post.slug}`} className="block">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        itemProp="image"
                      />
                    </div>
                  </Link>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-medium text-sage bg-sage/10 px-2 py-1 rounded">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock size={12} />
                        {post.readTime}
                      </span>
                    </div>
                    
                    <Link to={`/blog/${post.slug}`}>
                      <h3 
                        className="font-serif text-xl text-foreground mb-3 group-hover:text-sage transition-colors line-clamp-2"
                        itemProp="headline"
                      >
                        {post.title}
                      </h3>
                    </Link>
                    
                    <p 
                      className="text-foreground/70 text-sm mb-4 line-clamp-3"
                      itemProp="description"
                    >
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1" itemProp="author">
                          <User size={12} />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          <time itemProp="datePublished">{post.date}</time>
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-sage text-sage font-medium rounded-lg hover:bg-sage hover:text-white transition-colors">
                Cargar más artículos
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="bg-sage/5 py-16" aria-labelledby="newsletter-heading">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 id="newsletter-heading" className="font-serif text-3xl text-foreground mb-4">
                Recibe contenido exclusivo
              </h2>
              <p className="text-foreground/70 mb-6">
                Suscríbete a nuestra newsletter y recibe artículos, tips y recursos 
                gratuitos directamente en tu correo.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <label htmlFor="newsletter-email" className="sr-only">Tu correo electrónico</label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="flex-1 px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-sage/50"
                  required
                />
                <button 
                  type="submit"
                  className="px-6 py-3 bg-sage text-white font-medium rounded-lg hover:bg-sage-light transition-colors"
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
