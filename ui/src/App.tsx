import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider, useToast } from "./context/ToastContext";
import { setupInterceptors } from "./services/api";
import { DialogProvider } from "./context/DialogContext";
import "./index.css";
import { useEffect } from "react";
import { AppRoutes } from "./AppRoutes";

const AxiosInterceptorSetup = () => {
  const { showToast } = useToast();
  useEffect(() => {
    setupInterceptors(showToast);
  }, [showToast]);
  return null;
};

function App() {
  return (
    <ToastProvider>
      <AxiosInterceptorSetup />
      <DialogProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </DialogProvider>
    </ToastProvider>
  );
}

export default App;
