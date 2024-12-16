import React, { useState } from "react";
import { FaGoogle, FaGithub, FaLinkedin, FaCheckCircle } from "react-icons/fa";
import { Modal } from "./Modal";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSignup, setShowSignup] = useState(false);

  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [dob, setDob] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [message, setMessage] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);

        setMessage("Login bem-sucedido!");
        setShowMessageModal(true);
        setTimeout(() => {
          setShowMessageModal(false);

          onLogin();
        }, 2000);
      } else {
        setLoginError(data.message || "Erro ao fazer login");
      }
    } catch (error) {
      setLoginError("Erro ao fazer login");
    }
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

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateSignupForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await fetch("http://localhost:3000/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email: signupEmail,
            dob,
            password: signupPassword,
            confirmPassword,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setMessage("Cadastro bem-sucedido!");
          setShowMessageModal(true);
          setTimeout(() => {
            setShowMessageModal(false);
            setShowSignup(false);
            setName("");
            setSignupEmail("");
            setDob("");
            setSignupPassword("");
            setConfirmPassword("");
            setErrors({});
          }, 2000);
        } else {
          setSignupError(data.message || "Erro ao fazer cadastro");
        }
      } catch (error) {
        setSignupError("Erro ao fazer cadastro");
      }
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
        {loginError && <p className="error">{loginError}</p>}
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
              {signupError && <p className="error">{signupError}</p>}
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

      {showMessageModal && (
        <Modal>
          <div className="modal-content">
            <h2>{message}</h2>
            <FaCheckCircle size={50} color="green" />
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Login;
