const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Para permitir peticiones desde el frontend
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const secretKey = 's3cureR@ndom$ecretKey#2024!'; // Cambia esta clave por una más segura

// Middleware para permitir solicitudes desde el frontend
app.use(cors());
app.use(express.json());

// Conexión a la base de datos MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Contraseña2190.', // Usa tu contraseña
    database: 'capacitacionDB'
});

// CONEXION BASE DE DATOS
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to capacitacionDB');
});

// Ruta raíz para mostrar "SERVIDOR CORRIENDO"
app.get('/', (req, res) => {
    res.send('SERVIDOR CORRIENDO');
});

// Ruta para obtener los datos de la tabla usuarios
app.get('/usuarios', (req, res) => {
    const query = 'SELECT * FROM usuarios';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).json({ error: 'Error fetching users' });
            return;
        }
        res.json(results);
    });
});

app.post('/register', (req, res) => {
    const { email, password, nombre, apellidopaterno, apellidomaterno, rol, curp, rfc, maxestudios, sexo, departamento, tipo_contrato } = req.body;

    // Cifrar la contraseña
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ error: 'Error hashing password' });
        }

        // Insertar el nuevo usuario en la base de datos
        const query = 'INSERT INTO usuarios (email, password, nombre, apellidopaterno, apellidomaterno, rol, curp, rfc, maxestudios, sexo, departamento, tipo_contrato) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        connection.query(query, [email, hash, nombre, apellidopaterno, apellidomaterno, rol, curp, rfc, maxestudios, sexo, departamento, tipo_contrato], (err, results) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).json({ error: 'Error inserting user' });
            }
            const userId = results.insertId; // Obtener el ID del usuario recién creado
            res.status(201).json({ message: 'User registered successfully', userId }); // Devolver el ID
        });
    });
});




// Ruta para el login
// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Buscar usuario por email
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    connection.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Error fetching user' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = results[0];

        // Comparar contraseñas
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ error: 'Error comparing passwords' });
            }
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generar token
            const token = jwt.sign({ id: user.id, rol: user.rol }, secretKey, { expiresIn: '1h' });

            // Incluir el ID del usuario en la respuesta
            res.json({ token, rol: user.rol, id: user.id });
        });
    });
});


// Ruta para obtener el perfil del usuario
app.get('/profile', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Obtener el token del header
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });

        const userId = decoded.id;
        const query = 'SELECT * FROM usuarios WHERE id = ?';
        connection.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching user profile:', err);
                return res.status(500).json({ error: 'Error fetching user profile' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(results[0]);
        });
    });
});

app.post('/proponer-curso', (req, res) => {
    const {
        nombre_curso, asignaturas_requeridas, contenidos_requeridos, numero_docentes, tipo_asignatura, actividad_evento,
        objetivo, carreras_atendidas, periodo, turno, fecha_inicio, fecha_fin, justificacion,
        numero_horas, horario, lugar, requisitos, tipo_curso, nombre_instructor, apellidopaterno_instructor, apellidomaterno_instructor,
        curp_instructor, rfc_instructor, maxestudios_instructor, email_instructor, password_instructor, sexo_instructor, tipo_contrato_instructor,
        departamentosSeleccionados
    } = req.body;

    // Inserta el curso en la tabla de cursos_propuestos
    const queryCurso = `INSERT INTO cursos_propuestos (nombre_curso, asignaturas_requeridas, contenidos_requeridos, numero_docentes, tipo_asignatura,
      actividad_evento, objetivo, carreras_atendidas, periodo, turno, fecha_inicio, fecha_fin, justificacion,
      numero_horas, horario, lugar, requisitos, tipo_curso, nombre_instructor, apellidopaterno_instructor, apellidomaterno_instructor,
      curp_instructor, rfc_instructor, maxestudios_instructor, email_instructor, password_instructor, sexo_instructor, tipo_contrato_instructor)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`; 

    connection.query(queryCurso, [nombre_curso, asignaturas_requeridas, contenidos_requeridos, numero_docentes, tipo_asignatura,
        actividad_evento, objetivo, carreras_atendidas, periodo, turno, fecha_inicio, fecha_fin, justificacion,
        numero_horas, horario, lugar, requisitos, tipo_curso, nombre_instructor, apellidopaterno_instructor, apellidomaterno_instructor,
        curp_instructor, rfc_instructor, maxestudios_instructor, email_instructor, password_instructor, sexo_instructor, tipo_contrato_instructor], (err, result) => {
      
      if (err) {
        console.error('Error al insertar el curso:', err);
        res.status(500).json({ error: 'Error al insertar el curso' });  // Respuesta en JSON
      } else {
        const cursoId = result.insertId;  // Obtener el ID del curso recién insertado

        // Relacionar los departamentos seleccionados con el curso
        const queryDepartamento = `INSERT INTO departamentos (nombre) VALUES ?`; // Inserta solo el nombre del departamento
        const valoresDepartamento = departamentosSeleccionados.map(dep => [dep]);

        connection.query(queryDepartamento, [valoresDepartamento], (err, result) => {
          if (err) {
            console.error('Error al insertar departamentos:', err);
            res.status(500).json({ error: 'Error al insertar departamentos' });  // Respuesta en JSON
          } else {
            res.status(200).json({ message: 'Curso y departamentos insertados correctamente' });  // Respuesta en JSON
          }
        });
      }
    });
});




// Ruta para que el admin acepte o rechace un curso
app.put('/actualizar-curso/:id', (req, res) => {
    const { id } = req.params;
    const { estado } = req.body; // 'aceptado' o 'rechazado'
    const query = 'UPDATE cursos_propuestos SET estado = ? WHERE id = ?';
    connection.query(query, [estado, id], (err, results) => {
        if (err) {
            console.error('Error updating course status:', err);
            return res.status(500).json({ error: 'Error updating course status' });
        }
        res.status(200).json({ message: `Course ${estado}` });
    });
});

// Ruta para obtener los cursos propuestos
app.get('/cursos-propuestos', (req, res) => {
    const query = 'SELECT * FROM cursos_propuestos';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching proposed courses:', err);
            return res.status(500).json({ error: 'Error fetching proposed courses' });
        }
        res.json(results);
    });
});
// Ruta para obtener los cursos aceptados
app.get('/cursos', (req, res) => {
    const query = 'SELECT * FROM cursos_propuestos WHERE estado = "aceptado"';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching courses:', err);
            return res.status(500).json({ error: 'Error fetching courses' });
        }
        res.json(results);
    });
});
// Ruta para obtener detalles de un curso específico
app.get('/cursos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM cursos_propuestos WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching course details:', err);
            return res.status(500).json({ error: 'Error fetching course details' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json(results[0]);
    });
});
// Ruta para inscribir a un maestro en un curso
app.post('/inscribir/:id', (req, res) => {
    const { id } = req.params;  // ID del curso
    const token = req.headers.authorization?.split(' ')[1]; // Obtener el token del header
    
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });

        const userId = decoded.id; // Obtener el ID del usuario del token

        // Verificar el cupo del curso
        const cupoQuery = `
            SELECT cupo_actual, numero_docentes 
            FROM cursos_propuestos 
            WHERE id = ?
        `;

        connection.query(cupoQuery, [id], (err, result) => {
            if (err) {
                console.error('Error querying course capacity:', err);
                return res.status(500).json({ error: 'Error querying course capacity' });
            }

            const { cupo_actual, numero_docentes } = result[0];

            // Verificar si hay cupo
            if (cupo_actual >= numero_docentes) {
                return res.status(400).json({ error: 'Cupo lleno, no se puede inscribir' });
            }

            // Si hay cupo, insertar la inscripción
            const inscripcionQuery = 'INSERT INTO inscripciones (usuario_id, curso_id) VALUES (?, ?)';
            connection.query(inscripcionQuery, [userId, id], (err, result) => {
                if (err) {
                    console.error('Error inscribing in course:', err);
                    return res.status(500).json({ error: 'Error inscribing in course' });
                }

                // Actualizar el cupo en la tabla cursos_propuestos
                const actualizarCupoQuery = `
                    UPDATE cursos_propuestos 
                    SET cupo_actual = cupo_actual + 1 
                    WHERE id = ?
                `;
                connection.query(actualizarCupoQuery, [id], (err, result) => {
                    if (err) {
                        console.error('Error updating course capacity:', err);
                        return res.status(500).json({ error: 'Error updating course capacity' });
                    }

                    res.status(200).json({ message: 'Inscripción exitosa' });
                });
            });
        });
    });
});


// Ruta para verificar si un usuario está inscrito en un curso
app.get('/inscripciones/:cursoId', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Obtener el token del header
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });

        const userId = decoded.id;
        const { cursoId } = req.params;

        const query = 'SELECT * FROM inscripciones WHERE usuario_id = ? AND curso_id = ?';
        connection.query(query, [userId, cursoId], (err, results) => {
            if (err) {
                console.error('Error checking enrollment:', err);
                return res.status(500).json({ error: 'Error checking enrollment' });
            }
            res.json({ inscrito: results.length > 0 });
        });
    });
});
// Ruta para inscribir a un instructor en un curso
app.post('/instructor-curso', (req, res) => {
    const { id_usuario_instructor, id_curso_propuesto } = req.body;

    const query = 'INSERT INTO instructor_curso (id_usuario_instructor, id_curso_propuesto) VALUES (?, ?)';
    connection.query(query, [id_usuario_instructor, id_curso_propuesto], (err, results) => {
        if (err) {
            console.error('Error inserting instructor-course record:', err);
            return res.status(500).json({ error: 'Error inserting instructor-course record' });
        }
        res.status(201).json({ message: 'Instructor-course record created successfully' });
    });
});
app.get('/instructor/curso/:id', (req, res) => {
    const idInstructor = req.params.id;

    // Primero, obtener el id del curso desde la tabla instructor_curso
    const query = `SELECT cp.*
                   FROM instructor_curso ic
                   JOIN cursos_propuestos cp ON ic.id_curso_propuesto = cp.id
                   WHERE ic.id_usuario_instructor = ?`;

    connection.query(query, [idInstructor], (err, results) => {
        if (err) {
            console.error('Error al obtener el curso:', err);
            res.status(500).json({ error: 'Error al obtener el curso' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: 'No se encontró un curso para este instructor' });
        } else {
            res.json(results[0]);  // Enviar los detalles del curso encontrado
        }
    });
});

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
