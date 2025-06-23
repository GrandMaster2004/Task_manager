"use client";

import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import ErrorNotification from "./components/ErrorNotification";
// import ApiDebug from "./components/ApiDebug";

const AppContent = () => {
  const { user, loading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading TaskFlow...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {isLoginMode ? (
          <Login onToggleMode={() => setIsLoginMode(false)} />
        ) : (
          <Register onToggleMode={() => setIsLoginMode(true)} />
        )}
      </>
    );
  }

  return (
    <>
      <Dashboard />
      {error && (
        <ErrorNotification message={error} onClose={() => setError(null)} />
      )}
    
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
