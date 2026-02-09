import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

function Auth({ onLoginSuccess }) {
  const [esRegistro, setEsRegistro] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const endpoint = esRegistro ? '/registro' : '/login';
    
    try {
      const res = await axios.post(`${API_BASE}${endpoint}`, {
        username,
        password
      });

      if (esRegistro) {
        alert("¡Usuario creado! Ahora puedes iniciar sesión.");
        setEsRegistro(false);
      } else {
        onLoginSuccess(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Ocurrió un error");
    }
  };

  return (
    <div className="auth-container">
      <h2>{esRegistro ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          className="usernameInput"
          placeholder="Usuario" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="password" 
          className="passwordInput"
          placeholder="Contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="buttonJoin">
          {esRegistro ? 'Registrarse' : 'Entrar'}
        </button>
      </form>

      <button
      className="buttonChange"
        onClick={() => setEsRegistro(!esRegistro)}
      >
        {esRegistro ? '¿Ya tienes cuenta? Loguéate' : '¿No tienes cuenta? Regístrate'}
      </button>
    </div>
  );
}

export default Auth