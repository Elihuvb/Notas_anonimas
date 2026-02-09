import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CiBrightnessUp, CiDark, CiEdit, CiPaperplane, CiTrash, CiLogout } from "react-icons/ci";
import CajaComentarios from './CajaComentarios.jsx';

const API_BASE = import.meta.env.VITE_API_URL;

const Muro = ({ user }) => {
  const [notas, setNotas] = useState([])
  const [nuevaNota, setNuevaNota] = useState("")

  useEffect(() => {
    obtenerNotas()
  }, [])
  
  const obtenerNotas = async () => {
    try {
      const res = await axios.get(`${API_BASE}/muro`);
      setNotas(res.data)
    } catch (err) {
      console.error("Error al cargar notas", err)
    }
  }

  const handlePublicar = async (e) => {
    e.preventDefault();
    if (!nuevaNota.trim()) return;

    try {
      const res = await axios.post(`${API_BASE}/notas`, {
        contenido: nuevaNota,
        user_id: user.user_id
      });
      setNotas([res.data, ...notas]);
      setNuevaNota("");
    } catch (err) {
      alert("Error al publicar nota");
    }
  }

  const actualizarComentariosEnMuro = (notaId, nuevoComentario) => {
    const nuevasNotas = notas.map(nota => {
      if (nota.id === notaId) {
        return {
          ...nota,
          comentarios: [...nota.comentarios, nuevoComentario]
        }
      }
      return nota;
    })
    setNotas(nuevasNotas);
  }

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres borrar esta nota?")) return;
    try {
      await axios.delete(`${API_BASE}/notas/${id}`, {
        data: { user_id: user.user_id }
      });
      setNotas(notas.filter(n => n.id !== id));
    } catch (err) {
      alert("No puedes borrar esta nota.");
    }
  }

  return (
    <div className="muro">
      <div className="crearNota">
        <textarea
          placeholder="¿Qué estás pensando?"
          value={nuevaNota}
          onChange={(e) => setNuevaNota(e.target.value)}
        />
        <button onClick={handlePublicar}><CiEdit /></button>
      </div>

      <h3 className='tituloMuro'>Muro</h3>

      <div className="listaDeNotas">
        {notas.map(nota => (
          <div key={nota.id} className="tarjetaNota">
            <p>{nota.contenido}</p>
            <div>
              <small>{nota.fecha}</small>
              {user.user_id === nota.user_id && (
                <button onClick={() => handleEliminar(nota.id)} className='eliminarNota'><CiTrash /></button>
              )}
            </div>
            <div>
              {nota.comentarios && nota.comentarios.map(com => (
                <div key={com.id}>
                  <h5>Comentario:</h5> {com.texto}
                </div>
              ))}
            <CajaComentarios
              notaId={nota.id} 
              usuarioActual={user} 
              alAgregarComentario={actualizarComentariosEnMuro} 
            />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Muro