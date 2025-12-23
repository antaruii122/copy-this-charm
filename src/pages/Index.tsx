import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Purpose from "@/components/Purpose";
import VideoSection from "@/components/VideoSection";
import AboutMe from "@/components/AboutMe";
import Programs from "@/components/Programs";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    "name": "SomaIntegra - Salud Integrativa",
    "description": "Centro de salud integrativa especializado en bienestar holístico, coaching de vida, meditación y nutrición consciente.",
    "url": "https://somaintegra.com",
    "telephone": "+52-555-123-4567",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ciudad de México",
      "addressCountry": "MX"
    },
    "priceRange": "$$",
    "openingHours": "Mo-Fr 09:00-18:00",
    "sameAs": [
      "https://facebook.com/somaintegra",
      "https://instagram.com/somaintegra"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Programas de Bienestar",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Coaching de Vida Integral",
            "description": "Programa personalizado de coaching para transformar tu vida"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Meditación y Mindfulness",
            "description": "Cursos de meditación para reducir el estrés"
          }
        }
      ]
    }
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://somaintegra.com"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>SomaIntegra | Salud Integrativa y Bienestar Holístico</title>
        <meta name="description" content="Transforma tu vida con nuestros programas de salud integrativa. Coaching de vida, meditación, nutrición consciente y bienestar holístico en un solo lugar." />
        <meta name="keywords" content="salud integrativa, bienestar holístico, coaching de vida, meditación, mindfulness, nutrición consciente, wellness, México" />
        <link rel="canonical" href="https://somaintegra.com" />
        
        {/* Open Graph */}
        <meta property="og:title" content="SomaIntegra | Salud Integrativa y Bienestar Holístico" />
        <meta property="og:description" content="Transforma tu vida con programas de salud integrativa, coaching y bienestar holístico." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://somaintegra.com" />
        <meta property="og:image" content="https://somaintegra.com/og-image.jpg" />
        <meta property="og:locale" content="es_MX" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SomaIntegra | Salud Integrativa" />
        <meta name="twitter:description" content="Transforma tu vida con salud integrativa y bienestar holístico." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <Purpose />
          <VideoSection />
          <AboutMe />
          <Programs />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
