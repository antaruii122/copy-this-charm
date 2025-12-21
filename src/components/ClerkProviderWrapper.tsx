import { ClerkProvider } from "@clerk/clerk-react";
import { ReactNode } from "react";

// Clerk Publishable Key
const CLERK_PUBLISHABLE_KEY = "pk_test_cXVhbGl0eS13b21iYXQtOS5jbGVyay5hY2NvdW50cy5kZXYk";

interface ClerkProviderWrapperProps {
  children: ReactNode;
}

const ClerkProviderWrapper = ({ children }: ClerkProviderWrapperProps) => {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  );
};

export default ClerkProviderWrapper;
