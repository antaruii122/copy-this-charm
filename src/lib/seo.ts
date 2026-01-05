/**
 * SEO Utilities for Alimenta tu Fertilidad
 * Centralized SEO configuration and helpers
 */

export const SITE_CONFIG = {
    name: "Alimenta tu Fertilidad",
    title: "Alimenta tu Fertilidad | Nutrición Hormonal Femenina",
    description: "Transforma tu salud hormonal con nutrición consciente. Programas especializados en fertilidad, ciclo menstrual y bienestar femenino.",
    url: "https://alimentatufertilidad.com",
    locale: "es_MX",
    language: "es",
    author: "Alimenta tu Fertilidad",
    themeColor: "#B85871",

    contact: {
        email: "contacto@alimentatufertilidad.com",
        phone: "+52-555-123-4567",
    },

    social: {
        facebook: "https://facebook.com/alimentatufertilidad",
        instagram: "https://instagram.com/alimentatufertilidad",
        twitter: "@alimentatufertilidad",
    },

    address: {
        city: "Ciudad de México",
        country: "MX",
        countryName: "México",
        region: "MX-CMX",
        coords: {
            lat: 19.432608,
            lng: -99.133209,
        }
    }
};

/**
 * Generate Organization Schema
 */
export const getOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    "@id": `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    description: SITE_CONFIG.description,
    telephone: SITE_CONFIG.contact.phone,
    email: SITE_CONFIG.contact.email,
    address: {
        "@type": "PostalAddress",
        addressLocality: SITE_CONFIG.address.city,
        addressCountry: SITE_CONFIG.address.country,
    },
    geo: {
        "@type": "GeoCoordinates",
        latitude: SITE_CONFIG.address.coords.lat,
        longitude: SITE_CONFIG.address.coords.lng,
    },
    priceRange: "$$",
    openingHours: "Mo-Fr 09:00-18:00",
    sameAs: [
        SITE_CONFIG.social.facebook,
        SITE_CONFIG.social.instagram,
    ],
});

/**
 * Generate WebSite Schema with Search Action
 */
export const getWebsiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.url}/#website`,
    url: SITE_CONFIG.url,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    publisher: {
        "@id": `${SITE_CONFIG.url}/#organization`,
    },
    potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_CONFIG.url}/buscar?q={search_term_string}`,
        "query-input": "required name=search_term_string",
    },
    inLanguage: SITE_CONFIG.language,
});

/**
 * Generate Breadcrumb Schema
 */
export const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
    })),
});

/**
 * Generate FAQ Schema
 */
export const getFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
        },
    })),
});

/**
 * Generate Service Schema
 */
export const getServiceSchema = (service: {
    name: string;
    description: string;
    provider?: string;
    areaServed?: string;
}) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
        "@id": `${SITE_CONFIG.url}/#organization`,
    },
    areaServed: service.areaServed || SITE_CONFIG.address.city,
    serviceType: service.name,
});

/**
 * Generate Article/BlogPosting Schema
 */
export const getArticleSchema = (article: {
    title: string;
    description: string;
    image?: string;
    author?: string;
    datePublished: string;
    dateModified?: string;
    url: string;
}) => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    image: article.image || `${SITE_CONFIG.url}/og-image.jpg`,
    author: {
        "@type": "Person",
        name: article.author || SITE_CONFIG.name,
    },
    publisher: {
        "@id": `${SITE_CONFIG.url}/#organization`,
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    mainEntityOfPage: {
        "@type": "WebPage",
        "@id": article.url,
    },
    inLanguage: SITE_CONFIG.language,
});

/**
 * Generate Video Schema
 */
export const getVideoSchema = (video: {
    name: string;
    description: string;
    thumbnailUrl: string;
    uploadDate: string;
    contentUrl: string;
    duration?: string;
}) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    contentUrl: video.contentUrl,
    duration: video.duration,
    publisher: {
        "@id": `${SITE_CONFIG.url}/#organization`,
    },
});

/**
 * Generate meta tags for a page
 */
export const generateMetaTags = (page: {
    title?: string;
    description?: string;
    canonical?: string;
    image?: string;
    type?: string;
}) => {
    const title = page.title || SITE_CONFIG.title;
    const description = page.description || SITE_CONFIG.description;
    const canonical = page.canonical || SITE_CONFIG.url;
    const image = page.image || `${SITE_CONFIG.url}/og-image.jpg`;
    const type = page.type || "website";

    return {
        title,
        description,
        canonical,
        openGraph: {
            type,
            url: canonical,
            title,
            description,
            image,
            locale: SITE_CONFIG.locale,
            siteName: SITE_CONFIG.name,
        },
        twitter: {
            card: "summary_large_image",
            site: SITE_CONFIG.social.twitter,
            title,
            description,
            image,
        },
    };
};
