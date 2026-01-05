import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Purpose from "@/components/Purpose";
import VideoSection from "@/components/VideoSection";
import AboutMe from "@/components/AboutMe";
import Programs from "@/components/Programs";
import InstagramFeed from "@/components/InstagramFeed";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import {
  getOrganizationSchema,
  getWebsiteSchema,
  getBreadcrumbSchema,
  getFAQSchema,
  SITE_CONFIG
} from "@/lib/seo";

const Index = () => {
  // Organization and Website Schema
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();

  // Breadcrumb Schema
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Inicio", url: SITE_CONFIG.url }
  ]);

  // FAQ Schema for common questions
  const faqSchema = getFAQSchema([
    {
      question: "¿Qué es la salud integrativa?",
      answer: "La salud integrativa es un enfoque holístico que combina medicina convencional con terapias complementarias, abordando el bienestar físico, mental, emocional y espiritual de la persona."
    },
    {
      question: "¿Qué servicios ofrece SomaIntegra?",
      answer: "Ofrecemos coaching de vida integral, meditación y mindfulness, nutrición consciente, programas de bienestar personalizados y cursos online a través de nuestra aula virtual."
    },
    {
      question: "¿Necesito experiencia previa para los programas de meditación?",
      answer: "No, nuestros programas están diseñados para todos los niveles, desde principiantes hasta personas con experiencia en meditación."
    },
    {
      question: "¿Dónde están ubicados?",
      answer: "Estamos ubicados en Ciudad de México y también ofrecemos servicios online para llegar a personas en todo México y el mundo."
    }
  ]);

  // Service Catalog Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "Service",
        position: 1,
        name: "Coaching de Vida Integral",
        description: "Programa personalizado de coaching para transformar tu vida a través del autoconocimiento y el desarrollo personal.",
        provider: { "@id": `${SITE_CONFIG.url}/#organization` },
        areaServed: "Ciudad de México",
        serviceType: "Life Coaching"
      },
      {
        "@type": "Service",
        position: 2,
        name: "Meditación y Mindfulness",
        description: "Cursos y talleres de meditación para reducir el estrés, mejorar la concentración y encontrar paz interior.",
        provider: { "@id": `${SITE_CONFIG.url}/#organization` },
        areaServed: "Ciudad de México",
        serviceType: "Meditation Training"
      },
      {
        "@type": "Service",
        position: 3,
        name: "Nutrición Consciente",
        description: "Asesoría nutricional holística que considera no solo lo que comes, sino cómo y por qué lo comes.",
        provider: { "@id": `${SITE_CONFIG.url}/#organization` },
        areaServed: "Ciudad de México",
        serviceType: "Nutritional Counseling"
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

        {/* Structured Data - Organization */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>

        {/* Structured Data - Website */}
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>

        {/* Structured Data - Breadcrumb */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>

        {/* Structured Data - FAQ */}
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>

        {/* Structured Data - Service Catalog */}
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
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
          <InstagramFeed />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
