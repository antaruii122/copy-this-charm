import { SignIn, SignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Helmet>
        <title>{isSignUp ? "Registro" : "Iniciar Sesión"} | NUTFEM</title>
        <meta name="description" content="Accede a tu cuenta de NUTFEM para ver tus cursos y programas de nutrición femenina." />
      </Helmet>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-semibold text-primary mb-2">
            NUTFEM
          </h1>
          <p className="text-muted-foreground">
            {isSignUp ? "Crea tu cuenta" : "Bienvenida de nuevo"}
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
          {isSignUp ? (
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none p-0 bg-transparent",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
                  footerAction: "hidden",
                }
              }}
              routing="hash"
              signInUrl="/auth"
            />
          ) : (
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none p-0 bg-transparent",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
                  footerAction: "hidden",
                }
              }}
              routing="hash"
              signUpUrl="/auth"
            />
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isSignUp 
                ? "¿Ya tienes cuenta? Inicia sesión" 
                : "¿No tienes cuenta? Regístrate"}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
};

export default Auth;
