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
// Obtener cursos pendientes de revisión
app.get('/cursos-pendientes', (req, res) => {
    const query = `
        SELECT * FROM cursos_propuestos 
        WHERE estado = 'pendiente_revision'
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener cursos pendientes:', err);
            return res.status(500).json({ error: 'Error al obtener cursos pendientes' });
        }
        res.status(200).json(results);
    });
});

//Proponer un curso
app.post('/proponer-curso', (req, res) => {
    const {
        nombre_curso, asignaturas_requeridas, contenidos_requeridos, numero_docentes, tipo_asignatura, actividad_evento,
        objetivo, carreras_atendidas, periodo, turno, fecha_inicio, fecha_fin, justificacion,
        numero_horas, horario, lugar, requisitos, tipo_curso, nombre_instructor, apellidopaterno_instructor, apellidomaterno_instructor,
        curp_instructor, rfc_instructor, maxestudios_instructor, email_instructor, password_instructor, sexo_instructor, tipo_contrato_instructor,
        departamentosSeleccionados
    } = req.body;

    // Paso 1: Insertar el curso en la tabla `cursos_propuestos`
    const queryInsertCurso = `
        INSERT INTO cursos_propuestos (
            nombre_curso, asignaturas_requeridas, contenidos_requeridos, numero_docentes, tipo_asignatura, actividad_evento,
            objetivo, carreras_atendidas, periodo, turno, fecha_inicio, fecha_fin, justificacion, numero_horas, horario, lugar, 
            requisitos, tipo_curso, nombre_instructor, apellidopaterno_instructor, apellidomaterno_instructor, curp_instructor,
            rfc_instructor, maxestudios_instructor, email_instructor, password_instructor, sexo_instructor, tipo_contrato_instructor
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(queryInsertCurso, [
        nombre_curso, asignaturas_requeridas, contenidos_requeridos, numero_docentes, tipo_asignatura, actividad_evento,
        objetivo, carreras_atendidas, periodo, turno, fecha_inicio, fecha_fin, justificacion, numero_horas, horario, lugar,
        requisitos, tipo_curso, nombre_instructor, apellidopaterno_instructor, apellidomaterno_instructor, curp_instructor,
        rfc_instructor, maxestudios_instructor, email_instructor, password_instructor, sexo_instructor, tipo_contrato_instructor
    ], (err, result) => {
        if (err) {
            console.error('Error al insertar el curso:', err);
            return res.status(500).json({ error: 'Error al insertar el curso' });
        }

        // Obtén el ID del curso recién insertado
        const nuevoCursoId = result.insertId;

        // Paso 2: Insertar los departamentos seleccionados
        const queryInsertDeptos = `INSERT INTO departamentos (nombre) VALUES ?`;
        const valoresDepartamento = departamentosSeleccionados.map(dep => [dep]);

        connection.query(queryInsertDeptos, [valoresDepartamento], (err, result) => {
            if (err) {
                console.error('Error al insertar departamentos:', err);
                return res.status(500).json({ error: 'Error al insertar departamentos' });
            }

            // Paso 3: Obtener los IDs de los departamentos recién insertados
            const primerDepartamentoId = result.insertId;
            const nuevosDeptosIds = [];

            // Crear una lista de IDs de los departamentos insertados
            for (let i = 0; i < departamentosSeleccionados.length; i++) {
                nuevosDeptosIds.push(primerDepartamentoId + i);
            }

            // Paso 4: Insertar la relación curso-departamento en la tabla `departamento_curso`
            const queryRelacionCursoDepto = `INSERT INTO departamento_curso (departamento_id, curso_id) VALUES ?`;
            const valoresRelacion = nuevosDeptosIds.map(deptoId => [deptoId, nuevoCursoId]);

            connection.query(queryRelacionCursoDepto, [valoresRelacion], (err, result) => {
                if (err) {
                    console.error('Error al insertar la relación departamento-curso:', err);
                    return res.status(500).json({ error: 'Error al insertar la relación departamento-curso' });
                }

                // Respuesta exitosa
                res.status(200).json({ message: 'Curso, departamentos y relación insertados correctamente' });
            });
        });
    });
});



// // Ruta para que el admin acepte o rechace un curso
// app.put('/actualizar-curso/:id', (req, res) => {
//     const { id } = req.params;
//     const { estado } = req.body; // 'aceptado' o 'rechazado'
//     const query = 'UPDATE cursos_propuestos SET estado = ? WHERE id = ?';
//     connection.query(query, [estado, id], (err, results) => {
//         if (err) {
//             console.error('Error updating course status:', err);
//             return res.status(500).json({ error: 'Error updating course status' });
//         }
//         res.status(200).json({ message: `Course ${estado}` });
//     });
// });
app.put('/actualizar-curso/:id', (req, res) => {
    const cursoId = req.params.id;
    const { estado, comentario } = req.body;

    // Lista de estados permitidos
    const estadosPermitidos = ['pendiente', 'aceptado', 'rechazado', 'pendiente_revision'];

    // Verifica si el estado es válido
    if (!estadosPermitidos.includes(estado)) {
        return res.status(400).json({ error: 'Estado no válido' });
    }

    let query = 'UPDATE cursos_propuestos SET estado = ?, comentario_revision = ? WHERE id = ?';
    let values = [estado, comentario || null, cursoId];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al actualizar el curso:', error);
            res.status(500).json({ error: 'Error al actualizar el curso' });
        } else {
            res.status(200).json({ message: 'Curso actualizado correctamente' });
        }
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

app.get('/departamentos-por-curso/:cursoId', (req, res) => {
    const cursoId = req.params.cursoId;
    const query = `
        SELECT d.nombre 
        FROM departamentos d
        JOIN departamento_curso dc ON d.id = dc.departamento_id
        WHERE dc.curso_id = ?;
    `;

    connection.query(query, [cursoId], (err, results) => {
        if (err) {
            console.error('Error fetching departments for course:', err);
            return res.status(500).json({ error: 'Error fetching departments for course' });
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

app.get('/mi-perfil', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Obtener el token del header

    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });

        const userId = decoded.id; // Obtener el ID del usuario del token

        const userQuery = `SELECT departamento FROM usuarios WHERE id = ?`;
        connection.query(userQuery, [userId], (err, result) => {
            if (err) {
                console.error('Error querying user profile:', err);
                return res.status(500).json({ error: 'Error querying user profile' });
            }

            if (result.length > 0) {
                res.status(200).json(result[0]); // Enviar el departamento del usuario
            } else {
                res.status(404).json({ error: 'User not found' });
            }
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
// Ruta para obtener los maestros inscritos en un curso
app.get('/curso/:cursoId/maestros', (req, res) => {
    const cursoId = req.params.cursoId;

    // Consulta para obtener los maestros inscritos en el curso
    const query = `
        SELECT usuarios.nombre, usuarios.apellidopaterno, usuarios.apellidomaterno, usuarios.email
        FROM inscripciones
        JOIN usuarios ON inscripciones.usuario_id = usuarios.id
        WHERE inscripciones.curso_id = ? AND usuarios.rol = 'maestro';
    `;

    connection.query(query, [cursoId], (err, results) => {
        if (err) {
            console.error('Error fetching maestros:', err);
            return res.status(500).json({ error: 'Error fetching maestros' });
        }
        res.json(results); // Devuelve los resultados de los maestros
    });
});
// Ruta para obtener los detalles de un curso
app.get('/curso/:cursoId', (req, res) => {
    const cursoId = req.params.cursoId;

    // Consulta para obtener los detalles del curso
    const query = 'SELECT * FROM cursos_propuestos WHERE id = ?';  // Asegúrate de que la tabla 'cursos' y la columna 'id' existan
    connection.query(query, [cursoId], (err, results) => {
        if (err) {
            console.error('Error al obtener los detalles del curso:', err);
            return res.status(500).json({ error: 'Error al obtener los detalles del curso' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Curso no encontrado' });  // Maneja el caso en que no se encuentra el curso
        }

        res.json(results[0]);  // Devuelve el primer resultado que será el curso
    });
});

// Ruta para guardar asistencias de un curso
app.post('/curso/:cursoId/guardar-asistencias', (req, res) => {
    const cursoId = req.params.cursoId;
    const asistencias = req.body;  // Recibe la lista de asistencias

    // Inserta las asistencias en la base de datos
    const queryAsistencia = `INSERT INTO asistencias (curso_id, usuario_id, fecha, asistencia) VALUES ?`;

    // Formatea los datos para la inserción
    const registrosAsistencia = asistencias.map(asistencia => [asistencia.curso_id, asistencia.usuario_id, asistencia.fecha, asistencia.asistencia]);

    connection.query(queryAsistencia, [registrosAsistencia], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al insertar asistencias' });
        }
        res.json({ message: 'Asistencias guardadas exitosamente' });
    });
});

// Ruta para verificar si ya se ha pasado lista un día específico
app.get('/curso/:cursoId/asistencias', (req, res) => {
    const cursoId = req.params.cursoId;
    const fecha = req.query.fecha; // Obtiene la fecha desde los parámetros de consulta

    const query = `SELECT COUNT(*) AS existe FROM asistencias WHERE curso_id = ? AND fecha = ?`;

    connection.query(query, [cursoId, fecha], (err, results) => {
        if (err) {
            console.error('Error al verificar asistencias:', err);
            return res.status(500).json({ error: 'Error al verificar asistencias' });
        }
        // Si existe al menos un registro, entonces ya se ha pasado lista
        const existe = results[0].existe > 0;
        res.json({ existe });
    });
});

// Ruta para guardar asistencias de un curso
app.post('/curso/:cursoId/guardar-asistencias', (req, res) => {
    const cursoId = req.params.cursoId;
    const asistencias = req.body;  // Recibe la lista de asistencias

    // Inserta las asistencias en la base de datos
    const queryAsistencia = `INSERT INTO asistencias (curso_id, usuario_id, fecha, asistencia) VALUES ?`;

    // Formatea los datos para la inserción
    const registrosAsistencia = asistencias.map(asistencia => [asistencia.curso_id, asistencia.usuario_id, asistencia.fecha, asistencia.asistencia]);

    connection.query(queryAsistencia, [registrosAsistencia], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al insertar asistencias' });
        }
        res.json({ message: 'Asistencias guardadas exitosamente' });
    });
});

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});