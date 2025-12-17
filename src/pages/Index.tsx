import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Purpose from "@/components/Purpose";
import VideoSection from "@/components/VideoSection";
import AboutMe from "@/components/AboutMe";
import Programs from "@/components/Programs";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
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
  );
};

export default Index;
