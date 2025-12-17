import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserGreetingProps {
  initials?: string;
  name?: string;
}

const UserGreeting = ({ initials = "RT", name = "Ricardo Tapia" }: UserGreetingProps) => {
  return (
    <div className="flex items-center justify-between py-8 border-b border-border">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
          <span className="text-2xl font-semibold text-primary-foreground">{initials}</span>
        </div>
        
        {/* Greeting */}
        <div>
          <p className="text-muted-foreground text-sm">Hola,</p>
          <h2 className="text-xl font-semibold text-foreground">{name}</h2>
        </div>
      </div>

      {/* Notification Bell */}
      <Button variant="outline" size="icon" className="rounded-lg border-border">
        <Bell size={20} className="text-foreground/60" />
      </Button>
    </div>
  );
};

export default UserGreeting;
