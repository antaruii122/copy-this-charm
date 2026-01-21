import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ClerkProviderWrapper from "./components/ClerkProviderWrapper.tsx";
import { HelmetProvider } from 'react-helmet-async';
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <ClerkProviderWrapper>
      <App />
    </ClerkProviderWrapper>
  </HelmetProvider>
);
