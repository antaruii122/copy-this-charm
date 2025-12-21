import { useAuth, useUser, UserButton as ClerkUserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const UserButton = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return (
      <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
    );
  }

  if (!isSignedIn) {
    return (
      <Link to="/auth">
        <Button size="sm" variant="outline">
          Iniciar Sesión
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground hidden md:block">
        {user?.firstName || user?.emailAddresses[0]?.emailAddress}
      </span>
      <ClerkUserButton 
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: "w-8 h-8",
          }
        }}
      />
    </div>
  );
};

export default UserButton;
