from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["https://notas-anonimas.vercel.app/"]}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(80), unique = True, nullable = False)
    password_hash = db.Column(db.String(120), nullable = False)
    
    # la relacion del usuario con las notas
    notas = db.relationship('Nota', backref = 'usuario', lazy = True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Comentario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    texto = db.Column(db.String(300), nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=db.func.current_timestamp())
    # Relaciones
    user_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    nota_id = db.Column(db.Integer, db.ForeignKey('nota.id'), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "texto": self.texto,
            "usuario": Usuario.query.get(self.user_id).username, # Para saber quién comentó
            "fecha": self.fecha_creacion.strftime("%Y-%m-%d %H:%M:%S")
        }
    
class Nota(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    contenido = db.Column(db.String(200), nullable = False)
    fecha_creacion = db.Column(db.DateTime, default = db.func.current_timestamp())
    user_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable = False)
    comentarios = db.relationship('Comentario', backref='nota', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "contenido": self.contenido,
            "user_id": self.user_id, # Necesario para que React sepa si mostrar el botón 'borrar'
            "fecha": self.fecha_creacion.strftime("%Y-%m-%d %H:%M:%S"),
            "comentarios": [c.to_dict() for c in self.comentarios]
        }
        
with app.app_context():
    db.create_all()
        
@app.route('/api/muro', methods=['GET'])
def obtener_muro():
    todas_las_notas = Nota.query.order_by(Nota.fecha_creacion.desc()).all()
    return jsonify([n.to_dict() for n in todas_las_notas])

@app.route('/api/registro', methods=['POST'])
def registro():
    datos = request.get_json()
    username = datos.get('username')
    password = datos.get('password')
    
    if not username or not password:
        return jsonify({'mensaje': "Faltan datos"}), 400
    
    if Usuario.query.filter_by(username = username).first():
        return jsonify({'mensaje': "El usuario ya existe"}), 400
    
    nuevo_usuario = Usuario(username = username)
    nuevo_usuario.set_password(password)
    
    db.session.add(nuevo_usuario)
    db.session.commit()
    
    return jsonify({"mensaje": "Usuario registrado exitosamente"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    datos = request.get_json()
    user = Usuario.query.filter_by(username=datos.get('username')).first()

    if user and user.check_password(datos.get('password')):
        return jsonify({
            "mensaje": "Login exitoso",
            "user_id": user.id,
            "username": user.username
        }), 200
    
    return jsonify({"error": "Credenciales inválidas"}), 401

@app.route('/api/notas', methods = ['POST'])
def crear_nota():
    datos = request.get_json()
    contenido = datos.get('contenido')
    user_id = datos.get('user_id')

    if not contenido or not user_id:
        return jsonify({"error": "Contenido o usuario ausente"}), 400

    usuario = Usuario.query.get(user_id)
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    nueva_nota = Nota(contenido=contenido, user_id=user_id)
    
    db.session.add(nueva_nota)
    db.session.commit()

    return jsonify(nueva_nota.to_dict()), 201

@app.route('/api/notas/<int:id>', methods=['DELETE'])
def eliminar_nota(id):
    datos = request.get_json()
    user_id_cliente = datos.get('user_id')

    nota = Nota.query.get(id)
    
    if not nota:
        return jsonify({"error": "Nota no encontrada"}), 404

    if nota.user_id != user_id_cliente:
        return jsonify({"error": "No tienes permiso para borrar esta nota"}), 403

    db.session.delete(nota)
    db.session.commit()
    return jsonify({"mensaje": "Nota eliminada correctamente"})

@app.route('/api/notas/<int:id>/comentarios', methods=['POST'])
def crear_comentario(id):
    datos = request.get_json()
    
    nota = Nota.query.get(id)
    if not nota:
        return jsonify({"error": "La nota a la que intentas comentar no existe"}), 404
    
    nuevo_comentario = Comentario(
        texto = datos.get('texto'),
        user_id = datos.get('user_id'),
        nota_id = id
    )
    
    db.session.add(nuevo_comentario)
    db.session.commit()
    
    return jsonify(nuevo_comentario.to_dict()), 201

if __name__ == '__main__':
    app.run(debug=True)
