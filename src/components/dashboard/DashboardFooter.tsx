import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DashboardFooter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <footer className="mt-auto">
      {/* Newsletter Section */}
      <div className="bg-[#2a2a2a] py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Suscríbete a nuestro contenido
              </h3>
              <p className="text-white/70">
                ¡Entérate de todas nuestras actividades y promociones!
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-3">
              <Input
                type="email"
                placeholder="sample@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white border-0 rounded-lg h-12"
              />
              <Button
                type="submit"
                className="bg-[#9b8bb0] hover:bg-[#8a7a9f] text-white rounded-lg px-8 h-12"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-[#1a1a1a] py-4 px-4">
        <div className="container mx-auto text-center">
          <p className="text-white/50 text-sm">
            Página web creada por{" "}
            <a href="#" className="text-primary hover:underline">
              Agencia Fractal
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
