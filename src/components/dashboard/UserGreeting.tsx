import { Sparkles } from "lucide-react";

interface UserGreetingProps {
  initials?: string;
  name?: string;
}

const UserGreeting = ({
  initials = "RT",
  name = "Ricardo Tapia"
}: UserGreetingProps) => {
  return (
    <div className="flex items-center justify-between py-8 mb-6">
      <div className="flex items-center gap-6">
        {/* Avatar with glassmorphism */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-sage-dark rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-sage-dark flex items-center justify-center shadow-lg ring-4 ring-white/50 group-hover:scale-105 transition-transform">
            <span className="text-3xl font-bold text-primary-foreground drop-shadow-lg">{initials}</span>
          </div>
        </div>

        {/* Greeting with badge */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-2">
            <Sparkles className="w-3 h-3 text-primary" />
            <p className="text-primary text-xs font-medium tracking-wide">BIENVENIDO DE VUELTA</p>
          </div>
          <h2 className="text-3xl font-serif font-bold text-foreground">{name}</h2>
        </div>
      </div>
    </div>
  );
};

export default UserGreeting;
