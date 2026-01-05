import { Instagram } from "lucide-react";
import { useEffect, useState } from "react";

// Instagram Feed Component
const InstagramFeed = () => {
    const [posts, setPosts] = useState<any[]>([]);

    // Placeholder posts - In production, you'd fetch from Instagram API or use a service
    const placeholderPosts = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=400&fit=crop",
            caption: "Fertilidad y nutrición consciente 🌸",
            link: "https://www.instagram.com/alimentatufertilidad/"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop",
            caption: "Nutrición hormonal para mujeres 💚",
            link: "https://www.instagram.com/alimentatufertilidad/"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=400&fit=crop",
            caption: "Ciclo menstrual y alimentación 🌿",
            link: "https://www.instagram.com/alimentatufertilidad/"
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop",
            caption: "Recetas para cada fase del ciclo 🍽️",
            link: "https://www.instagram.com/alimentatufertilidad/"
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&h=400&fit=crop",
            caption: "Bienestar hormonal natural ✨",
            link: "https://www.instagram.com/alimentatufertilidad/"
        },
        {
            id: 6,
            image: "https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?w=400&h=400&fit=crop",
            caption: "Alimenta tu fertilidad 💗",
            link: "https://www.instagram.com/alimentatufertilidad/"
        }
    ];

    useEffect(() => {
        // In production, fetch from Instagram API here
        setPosts(placeholderPosts);
    }, []);

    return (
        <section className="relative py-20 md:py-32 bg-gradient-to-b from-background to-cream overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-float" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-primary rounded-full mb-6 shadow-lg">
                        <Instagram className="w-5 h-5 text-white animate-pulse-slow" />
                        <span className="text-white text-sm font-bold tracking-wider">SÍGUENOS EN INSTAGRAM</span>
                    </div>

                    <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">
                        <span className="block text-gradient">@alimentatufertilidad</span>
                    </h2>

                    <p className="text-muted-foreground text-xl leading-relaxed mb-8">
                        Únete a nuestra comunidad y descubre tips diarios sobre nutrición hormonal, fertilidad y bienestar femenino
                    </p>

                    <a
                        href="https://www.instagram.com/alimentatufertilidad/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-primary text-white font-bold rounded-2xl hover:scale-105 hover:glow transition-all duration-300 shadow-lg"
                    >
                        <Instagram className="w-5 h-5" />
                        Seguir en Instagram
                    </a>
                </div>

                {/* Instagram Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {posts.map((post, index) => (
                        <a
                            key={post.id}
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square overflow-hidden rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1 animate-fade-up"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <img
                                src={post.image}
                                alt={post.caption}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center">
                                <Instagram className="w-8 h-8 text-white transform scale-0 group-hover:scale-100 transition-transform duration-300" />
                            </div>
                        </a>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-12 animate-fade-up" style={{ animationDelay: "0.4s" }}>
                    <p className="text-muted-foreground mb-4">
                        🌸 Más de <span className="text-primary font-bold">500+ mujeres</span> transformando su salud hormonal
                    </p>
                </div>
            </div>
        </section>
    );
};

export default InstagramFeed;
