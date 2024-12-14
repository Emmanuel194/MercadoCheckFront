import React, { useState } from "react";
import { FaGoogle, FaGithub, FaLinkedin } from "react-icons/fa";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSignup, setShowSignup] = useState(false);

  // Estados para os campos de cadastro
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [dob, setDob] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const validateSignupForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Nome é obrigatório";
    if (!signupEmail) {
      newErrors.signupEmail = "E-mail é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(signupEmail)) {
      newErrors.signupEmail = "E-mail inválido";
    }
    if (!dob) newErrors.dob = "Data de nascimento é obrigatória";
    if (!signupPassword) {
      newErrors.signupPassword = "Senha é obrigatória";
    } else if (signupPassword.length < 6) {
      newErrors.signupPassword = "Senha deve ter pelo menos 6 caracteres";
    }
    if (signupPassword !== confirmPassword)
      newErrors.confirmPassword = "As senhas não coincidem";
    return newErrors;
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateSignupForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // Lógica para processar o cadastro aqui
      setShowSignup(false);
      // Limpa os campos e os erros após o envio bem-sucedido
      setName("");
      setSignupEmail("");
      setDob("");
      setSignupPassword("");
      setConfirmPassword("");
      setErrors({});
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
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
        <button
          type="button"
          className="signup-button"
          onClick={() => setShowSignup(true)}
        >
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

      {showSignup && (
        <div className="signup-popup">
          <div className="signup-form">
            <h2>Cadastro</h2>
            <form onSubmit={handleSignupSubmit}>
              <div>
                <label>Nome:</label>
                <input
                  type="text"
                  placeholder="Digite seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                {errors.name && <p className="error">{errors.name}</p>}
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  placeholder="Digite seu email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
                {errors.signupEmail && (
                  <p className="error">{errors.signupEmail}</p>
                )}
              </div>
              <div>
                <label>Data de Nascimento:</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
                {errors.dob && <p className="error">{errors.dob}</p>}
              </div>
              <div>
                <label>Senha:</label>
                <input
                  type="password"
                  placeholder="Digite sua senha"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
                {errors.signupPassword && (
                  <p className="error">{errors.signupPassword}</p>
                )}
              </div>
              <div>
                <label>Confirme a Senha:</label>
                <input
                  type="password"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {errors.confirmPassword && (
                  <p className="error">{errors.confirmPassword}</p>
                )}
              </div>
              <button type="submit">Cadastrar</button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowSignup(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
