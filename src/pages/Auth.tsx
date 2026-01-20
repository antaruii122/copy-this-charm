import { SignIn, SignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Leaf } from "lucide-react";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4 relative overflow-hidden">
      <Helmet>
        <title>{isSignUp ? "Registro" : "Iniciar Sesión"} | NUTFEM</title>
        <meta name="description" content="Accede a tu cuenta de NUTFEM para ver tus cursos y programas de nutrición femenina." />
      </Helmet>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <span className="font-serif text-3xl font-bold text-primary">R</span>
          </div>
          <h1 className="font-serif text-4xl font-semibold text-primary mb-2 tracking-wide">
            Ricardo Rules
          </h1>
          <p className="text-muted-foreground text-lg">
            {isSignUp ? "Crea tu cuenta de estudiante" : "Accede a tu Aula Virtual"}
          </p>
          <p className="text-muted-foreground/70 text-sm mt-1">
            Plataforma educativa premium
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-border/50 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

          <div className="relative z-10">
            {isSignUp ? (
              <SignUp
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none p-0 bg-transparent",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "border-border/50 hover:bg-primary/5 transition-colors",
                    formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all",
                    formFieldInput: "border-border/50 focus:border-primary focus:ring-primary/20",
                    footerAction: "hidden",
                    dividerLine: "bg-border/30",
                    dividerText: "text-muted-foreground",
                    formFieldLabel: "text-foreground font-medium",
                  }
                }}
                routing="hash"
                signInUrl="/auth"
                forceRedirectUrl="/aula-virtual"
              />
            ) : (
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none p-0 bg-transparent",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "border-border/50 hover:bg-primary/5 transition-colors",
                    formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all",
                    formFieldInput: "border-border/50 focus:border-primary focus:ring-primary/20",
                    footerAction: "hidden",
                    dividerLine: "bg-border/30",
                    dividerText: "text-muted-foreground",
                    formFieldLabel: "text-foreground font-medium",
                  }
                }}
                routing="hash"
                signUpUrl="/auth"
                forceRedirectUrl="/aula-virtual"
              />
            )}

            {/* Toggle Auth Mode */}
            <div className="mt-6 pt-6 border-t border-border/30 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {isSignUp
                  ? "¿Ya tienes cuenta? Inicia sesión"
                  : "¿No tienes cuenta? Regístrate"}
              </button>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Volver al inicio</span>
          </a>
        </div>

        {/* Trust indicators */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground/60">
            Acceso seguro y encriptado
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
