import React, { useState } from "react";
import { FaGoogle, FaGithub, FaLinkedin } from "react-icons/fa";
import "./Login.css";

function Login() {
  // Removido o `onLogin` da função
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Apenas evitar a submissão do formulário por enquanto
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label>E-mail:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
          />
        </div>
        <button type="submit">Entrar</button>
        <button type="button" className="signup-button">
          Cadastre-se
        </button>
        <div className="social-login">
          <button
            className="social-button google-button"
            onClick={() =>
              (window.location.href = "http://localhost:3000/auth/google")
            }
          >
            <FaGoogle />
          </button>
          <button
            className="social-button github-button"
            onClick={() =>
              (window.location.href = "http://localhost:3000/auth/github")
            }
          >
            <FaGithub />
          </button>
          <button
            className="social-button linkedin-button"
            onClick={() =>
              (window.location.href = "http://localhost:3000/auth/linkedin")
            }
          >
            <FaLinkedin />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
