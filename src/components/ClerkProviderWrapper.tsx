import { ClerkProvider } from "@clerk/clerk-react";
import { ReactNode } from "react";

// IMPORTANT: Replace this with your actual Clerk Publishable Key
const CLERK_PUBLISHABLE_KEY = "pk_test_YOUR_PUBLISHABLE_KEY_HERE";

interface ClerkProviderWrapperProps {
  children: ReactNode;
}

const ClerkProviderWrapper = ({ children }: ClerkProviderWrapperProps) => {
  if (!CLERK_PUBLISHABLE_KEY || CLERK_PUBLISHABLE_KEY === "pk_test_YOUR_PUBLISHABLE_KEY_HERE") {
    console.warn("Clerk Publishable Key not configured. Please add your key to ClerkProviderWrapper.tsx");
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  );
};

export default ClerkProviderWrapper;
