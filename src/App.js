import React, { useEffect, useState } from "react";
import Login from "./components/login";
import Dashboard from "./components/dashboard";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    if (isAuthenticated) {
      document.body.className = "dashboard-background";
    } else {
      document.body.className = "login-background";
    }
  }, [isAuthenticated]);

  return (
    <div className="App">
      {!isAuthenticated ? <Login onLogin={handleLogin} /> : <Dashboard />}
    </div>
  );
}

export default App;
