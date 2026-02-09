import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

const CajaComentarios = ({ notaId, usuarioActual, alAgregarComentario }) => {
  const [texto, setTexto] = useState("");
  const [mostrandoInput, setMostrandoInput] = useState(false);

  const enviarComentario = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;

    try {
      const res = await axios.post(`${API_BASE}/notas/${notaId}/comentarios`, {
        texto: texto,
        user_id: usuarioActual.user_id
      });

      alAgregarComentario(notaId, res.data);
      setTexto("");
      setMostrandoInput(false);
    } catch (err) {
      alert("Error al enviar comentario");
    }
  };

  return (
    <div>
      {!mostrandoInput ? (
        <button onClick={() => setMostrandoInput(true)} className='botonDeComentario'>
          Comentar
        </button>
      ) : (
        <form onSubmit={enviarComentario}>
          <input 
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe un comentario..."
            className='inputTextComentario'
            autoFocus
          />
          <button type="submit" className='botonDeComentario'>Enviar</button>
          <button type="button" onClick={() => setMostrandoInput(false)} className='botonDeComentario'>✖</button>
        </form>
      )}
    </div>
  );
};

export default CajaComentarios;