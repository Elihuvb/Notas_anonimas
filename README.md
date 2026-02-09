📝 Muro de Notas Anónimas (Full-Stack)

Este es un proyecto Full-Stack interactivo que permite a los usuarios registrarse y compartir pensamientos, notas o confesiones de forma anónima en un muro público, fomentando la interacción comunitaria mediante comentarios.

✨ Características Principales

🔐 Sistema de Autenticación Completo: Registro e inicio de sesión con cifrado de contraseñas mediante Werkzeug.

📌 Muro Interactivo: Los usuarios pueden publicar notas que son visibles para toda la comunidad.

💬 Hilos de Comentarios: Implementación de rutas anidadas para permitir comentarios en cada nota.

🌓 Dark Mode: Interfaz adaptativa con persistencia de tema mediante Sass y LocalStorage.

🗑️ Gestión de Contenido: Los usuarios tienen permisos exclusivos para eliminar sus propias notas (validación en Backend).

📱 Diseño Responsivo: Interfaz moderna y minimalista adaptada a dispositivos móviles.

🛠️ Stack Tecnológico


Frontend

React.js (Vite): Biblioteca principal para la interfaz de usuario.

Sass: Preprocesador CSS para la gestión de estilos y mixins de temas.

Axios: Cliente HTTP para comunicación con la API.

React Hooks: Uso intensivo de useState, useEffect y custom flows para autenticación.


Backend

Flask: Micro-framework de Python para la API REST.

SQLAlchemy: ORM para la gestión de la base de datos relacional.

Flask-CORS: Manejo de políticas de intercambio de recursos entre dominios.

SQLite: Motor de base de datos ligero para persistencia de datos local.



📂 Estructura del Proyecto

<img width="3999" height="1999" alt="image" src="https://github.com/user-attachments/assets/4a416bea-c6fb-49fe-b0e0-97a20d452688" />

├── backend/

│   ├── app.py              # Punto de entrada y configuración de la API

│   ├── database.db         # Base de datos SQLite (local)

│   └── requirements.txt    # Dependencias de Python

├── frontend/

│   ├── src/

│   │   ├── components/     # Componentes: Auth, Muro, CajaComentarios

│   │   ├── styles/         # Archivos .scss (Mixins y variables)

│   │   └── App.jsx         # Lógica principal y ruteo

│   └── package.json        # Dependencias de Node

└── README.md

💡 Lo que aprendí en este proyecto

Relaciones en Bases de Datos: Aprendí a implementar relaciones Uno a Muchos (Usuario-Notas) y relaciones anidadas (Notas-Comentarios) usando Foreign Keys.

Seguridad en el Cliente y Servidor: No basta con ocultar botones en el frontend; implementé validaciones en el backend para asegurar que solo el dueño de un recurso pueda eliminarlo.

Diseño de API REST: Aplicación de buenas prácticas en el diseño de URLs semánticas y códigos de respuesta HTTP adecuados.
