import { useState } from 'react';
import Auth from './components/Auth.jsx';
import Muro from './components/Muro.jsx'
import { CiBrightnessUp, CiDark, CiEdit, CiPaperplane, CiTrash, CiLogout } from "react-icons/ci";
import './App.scss'

const API_BASE = import.meta.env.VITE_API_URL;

function App() {

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('usuario')) || null);
  const [notas, setNotas] = useState([]);
  const [textoNota, setTextoNota] = useState("");

  const finalizarLogin = (datosUsuario) => {
    setUser(datosUsuario);
    localStorage.setItem('usuario', JSON.stringify(datosUsuario));
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem('usuario');
  }

  const publicarNota = async () => {
    if (!textoNota) return;
    const res = await axios.post(`${API_BASE}/notas`, {
      contenido: textoNota,
      user_id: user.id
    })
    setNotas([res.data, ...notas]);
    setTextoNota("");
  }

  const eliminarNota = async (id) => {
    await axios.delete(`${API_BASE}/notas/${id}`, { data: { user_id: user.id } });
    setNotas(notas.filter(n => n.id !== id));
  };

  return (
    <div className="app">
      {!user ? (
        <Auth onLoginSuccess={finalizarLogin} />
      ) : (
        <div>
          <header>
            <h1>{user.username}</h1>
            <button onClick={logout}><CiLogout /></button>
          </header>
          <div>

          {notas.map(nota => (
            <div key={nota.id} className="nota">
              <p>{nota.contenido}</p>
              <small>{nota.fecha}</small>

              {user && nota.user_id === user.id && (
                <button onClick={() => eliminarNota(nota.id)}>Borrar</button>
              )}

              <div>
                {nota.comentarios.map(c => (
                  <p key={c.id}>
                    {c.texto}
                  </p>
                  ))}
                  {user && (
                    <button onClick={() => alert("Aquí abrirías un input para comentar en la nota " + nota.id)}>Comentar</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {user && <Muro user={user} />}
        </div>
      )}
    </div>
  );
}

export default App