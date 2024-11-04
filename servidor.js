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

// //Proponer un curso
// app.post('/proponer-curso', (req, res) => {
//     const {
//         nombre_curso, asignaturas_requeridas, contenidos_requeridos, numero_docentes, tipo_asignatura, actividad_evento,
//         objetivo, carreras_atendidas, periodo, turno, fecha_inicio, fecha_fin, justificacion,
//         numero_horas, horario, lugar, requisitos, tipo_curso, nombre_instructor, apellidopaterno_instructor, apellidomaterno_instructor,
//         curp_instructor, rfc_instructor, maxestudios_instructor, email_instructor, password_instructor, sexo_instructor, tipo_contrato_instructor,
//         departamentosSeleccionados
//     } = req.body;

//     // Paso 1: Insertar el curso en la tabla `cursos_propuestos`
//     const queryInsertCurso = `
//         INSERT INTO cursos_propuestos (
//             nombre_curso, asignaturas_requeridas, contenidos_requeridos, numero_docentes, tipo_asignatura, actividad_evento,
//             objetivo, carreras_atendidas, periodo, turno, fecha_inicio, fecha_fin, justificacion, numero_horas, horario, lugar, 
//             requisitos, tipo_curso, nombre_instructor, apellidopaterno_instructor, apellidomaterno_instructor, curp_instructor,
//             rfc_instructor, maxestudios_instructor, email_instructor, password_instructor, sexo_instructor, tipo_contrato_instructor
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     connection.query(queryInsertCurso, [
//         nombre_curso, asignaturas_requeridas, contenidos_requeridos, numero_docentes, tipo_asignatura, actividad_evento,
//         objetivo, carreras_atendidas, periodo, turno, fecha_inicio, fecha_fin, justificacion, numero_horas, horario, lugar,
//         requisitos, tipo_curso, nombre_instructor, apellidopaterno_instructor, apellidomaterno_instructor, curp_instructor,
//         rfc_instructor, maxestudios_instructor, email_instructor, password_instructor, sexo_instructor, tipo_contrato_instructor
//     ], (err, result) => {
//         if (err) {
//             console.error('Error al insertar el curso:', err);
//             return res.status(500).json({ error: 'Error al insertar el curso' });
//         }

//         // Obtén el ID del curso recién insertado
//         const nuevoCursoId = result.insertId;

//         // Paso 2: Insertar los departamentos seleccionados
//         const queryInsertDeptos = `INSERT INTO departamentos (nombre) VALUES ?`;
//         const valoresDepartamento = departamentosSeleccionados.map(dep => [dep]);

//         connection.query(queryInsertDeptos, [valoresDepartamento], (err, result) => {
//             if (err) {
//                 console.error('Error al insertar departamentos:', err);
//                 return res.status(500).json({ error: 'Error al insertar departamentos' });
//             }

//             // Paso 3: Obtener los IDs de los departamentos recién insertados
//             const primerDepartamentoId = result.insertId;
//             const nuevosDeptosIds = [];

//             // Crear una lista de IDs de los departamentos insertados
//             for (let i = 0; i < departamentosSeleccionados.length; i++) {
//                 nuevosDeptosIds.push(primerDepartamentoId + i);
//             }

//             // Paso 4: Insertar la relación curso-departamento en la tabla `departamento_curso`
//             const queryRelacionCursoDepto = `INSERT INTO departamento_curso (departamento_id, curso_id) VALUES ?`;
//             const valoresRelacion = nuevosDeptosIds.map(deptoId => [deptoId, nuevoCursoId]);

//             connection.query(queryRelacionCursoDepto, [valoresRelacion], (err, result) => {
//                 if (err) {
//                     console.error('Error al insertar la relación departamento-curso:', err);
//                     return res.status(500).json({ error: 'Error al insertar la relación departamento-curso' });
//                 }

//                 // Respuesta exitosa
//                 res.status(200).json({ message: 'Curso, departamentos y relación insertados correctamente' });
//             });
//         });
//     });
// });

app.post('/proponer-curso', (req, res) => {
    const {
        nombre_curso, asignaturas_requeridas, contenidos_requeridos, numero_docentes, tipo_asignatura, actividad_evento,
        objetivo, carreras_atendidas, periodo, turno, fecha_inicio, fecha_fin, justificacion,
        numero_horas, horario, lugar, requisitos, tipo_curso, nombre_instructor, apellidopaterno_instructor, apellidomaterno_instructor,
        curp_instructor, rfc_instructor, maxestudios_instructor, email_instructor, password_instructor, sexo_instructor, tipo_contrato_instructor,
        departamentosSeleccionados, id_jefe  // <-- Asegúrate de recibir `id_jefe`
    } = req.body;

    const queryInsertCurso = `INSERT INTO cursos_propuestos (
        nombre_curso, asignaturas_requeridas, contenidos_requeridos, numero_docentes, tipo_asignatura, actividad_evento,
        objetivo, carreras_atendidas, periodo, turno, fecha_inicio, fecha_fin, justificacion, numero_horas, horario, lugar, 
        requisitos, tipo_curso, nombre_instructor, apellidopaterno_instructor, apellidomaterno_instructor, curp_instructor,
        rfc_instructor, maxestudios_instructor, email_instructor, password_instructor, sexo_instructor, tipo_contrato_instructor
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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

        const nuevoCursoId = result.insertId;

        // Paso adicional: Insertar en jefe_curso
        const queryInsertJefeCurso = 'INSERT INTO jefe_curso (id_curso, id_jefe) VALUES (?, ?)';
        connection.query(queryInsertJefeCurso, [nuevoCursoId, id_jefe], (err, result) => {
            if (err) {
                console.error('Error al insertar en jefe_curso:', err);
                return res.status(500).json({ error: 'Error al asociar jefe con el curso' });
            }

            // Insertar los departamentos seleccionados y la relación curso-departamento
            const queryInsertDeptos = 'INSERT INTO departamentos (nombre) VALUES ?';
            const valoresDepartamento = departamentosSeleccionados.map(dep => [dep]);

            connection.query(queryInsertDeptos, [valoresDepartamento], (err, result) => {
                if (err) {
                    console.error('Error al insertar departamentos:', err);
                    return res.status(500).json({ error: 'Error al insertar departamentos' });
                }

                const primerDepartamentoId = result.insertId;
                const nuevosDeptosIds = [];

                for (let i = 0; i < departamentosSeleccionados.length; i++) {
                    nuevosDeptosIds.push(primerDepartamentoId + i);
                }

                const queryRelacionCursoDepto = 'INSERT INTO departamento_curso (departamento_id, curso_id) VALUES ?';
                const valoresRelacion = nuevosDeptosIds.map(deptoId => [deptoId, nuevoCursoId]);

                connection.query(queryRelacionCursoDepto, [valoresRelacion], (err, result) => {
                    if (err) {
                        console.error('Error al insertar la relación departamento-curso:', err);
                        return res.status(500).json({ error: 'Error al insertar la relación departamento-curso' });
                    }

                    res.status(200).json({ message: 'Curso, jefe, departamentos y relaciones insertados correctamente' });
                });
            });
        });
    });
});
// Eliminar un curso propuesto
app.delete('/eliminar-curso/:id', (req, res) => {
    const cursoId = req.params.id;

    // Paso 1: Eliminar relaciones con jefe en la tabla `jefe_curso`
    const queryEliminarJefeCurso = `
        DELETE FROM jefe_curso WHERE id_curso = ?
    `;

    connection.query(queryEliminarJefeCurso, [cursoId], (err, result) => {
        if (err) {
            console.error('Error al eliminar relación jefe-curso:', err);
            return res.status(500).json({ error: 'Error al eliminar relación jefe-curso' });
        }

        // Paso 2: Eliminar relaciones con departamentos en la tabla `departamento_curso`
        const queryEliminarRelaciones = `
            DELETE FROM departamento_curso WHERE curso_id = ?
        `;

        connection.query(queryEliminarRelaciones, [cursoId], (err, result) => {
            if (err) {
                console.error('Error al eliminar relación curso-departamento:', err);
                return res.status(500).json({ error: 'Error al eliminar relación curso-departamento' });
            }

            // Paso 3: Eliminar el curso de la tabla `cursos_propuestos`
            const queryEliminarCurso = `
                DELETE FROM cursos_propuestos WHERE id = ?
            `;

            connection.query(queryEliminarCurso, [cursoId], (err, result) => {
                if (err) {
                    console.error('Error al eliminar el curso:', err);
                    return res.status(500).json({ error: 'Error al eliminar el curso' });
                }

                res.status(200).json({ message: 'Curso eliminado exitosamente' });
            });
        });
    });
});

// // Eliminar un curso propuesto
// app.delete('/eliminar-curso/:id', (req, res) => {
//     const cursoId = req.params.id;

//     // Paso 1: Eliminar relaciones con departamentos en la tabla `departamento_curso`
//     const queryEliminarRelaciones = `
//         DELETE FROM departamento_curso WHERE curso_id = ?
//     `;

//     connection.query(queryEliminarRelaciones, [cursoId], (err, result) => {
//         if (err) {
//             console.error('Error al eliminar relación curso-departamento:', err);
//             return res.status(500).json({ error: 'Error al eliminar relación curso-departamento' });
//         }

//         // Paso 2: Eliminar el curso de la tabla `cursos_propuestos`
//         const queryEliminarCurso = `
//             DELETE FROM cursos_propuestos WHERE id = ?
//         `;

//         connection.query(queryEliminarCurso, [cursoId], (err, result) => {
//             if (err) {
//                 console.error('Error al eliminar el curso:', err);
//                 return res.status(500).json({ error: 'Error al eliminar el curso' });
//             }

//             // Respuesta exitosa
//             res.status(200).json({ message: 'Curso eliminado correctamente' });
//         });
//     });
// });


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

            // Si hay cupo, insertar la inscripción en la tabla inscripciones
            const inscripcionQuery = `
                INSERT INTO inscripciones (usuario_id, curso_id) 
                VALUES (?, ?)
            `;
            connection.query(inscripcionQuery, [userId, id], (err, result) => {
                if (err) {
                    console.error('Error inscribing in course:', err);
                    return res.status(500).json({ error: 'Error inscribing in course' });
                }

                // Insertar en la tabla usuario_requisitos
                const usuarioRequisitosQuery = `
                    INSERT INTO usuario_requisitos 
                    (usuario_id, curso_id, asistencias, calificacion, evidencias, encuesta1, encuestajefes) 
                    VALUES (?, ?, 0, 0, 0, 0, 0)
                `;
                connection.query(usuarioRequisitosQuery, [userId, id], (err, result) => {
                    if (err) {
                        console.error('Error inserting into usuario_requisitos:', err);
                        return res.status(500).json({ error: 'Error inserting into usuario_requisitos' });
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
// Ruta para obtener los maestros inscritos en un curso
app.get('/curso/:cursoId/maestros', (req, res) => {
    const cursoId = req.params.cursoId;

    // Consulta para obtener los maestros inscritos en el curso, asegurando que el campo `id` esté presente
    const query = `
        SELECT usuarios.id, usuarios.nombre, usuarios.apellidopaterno, usuarios.apellidomaterno, usuarios.email
        FROM inscripciones
        JOIN usuarios ON inscripciones.usuario_id = usuarios.id
        WHERE inscripciones.curso_id = ? AND usuarios.rol = 'maestro';
    `;

    connection.query(query, [cursoId], (err, results) => {
        if (err) {
            console.error('Error fetching maestros:', err);
            return res.status(500).json({ error: 'Error fetching maestros' });
        }
        res.json(results); // Devuelve los resultados de los maestros, ahora con el `id`
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

// // Ruta para guardar asistencias de un curso
// app.post('/curso/:cursoId/guardar-asistencias', (req, res) => {
//     const cursoId = req.params.cursoId;
//     const asistencias = req.body;  // Recibe la lista de asistencias

//     // Inserta las asistencias en la base de datos
//     const queryAsistencia = `INSERT INTO asistencias (curso_id, usuario_id, fecha, asistencia) VALUES ?`;

//     // Formatea los datos para la inserción
//     const registrosAsistencia = asistencias.map(asistencia => [asistencia.curso_id, asistencia.usuario_id, asistencia.fecha, asistencia.asistencia]);

//     connection.query(queryAsistencia, [registrosAsistencia], (err) => {
//         if (err) {
//             return res.status(500).json({ error: 'Error al insertar asistencias' });
//         }
//         res.json({ message: 'Asistencias guardadas exitosamente' });
//     });
// });

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

app.get('/asistencias/:cursoId/:usuarioId', (req, res) => {
    const cursoId = req.params.cursoId;
    const usuarioId = req.params.usuarioId;

    console.log('Curso ID:', cursoId); // Verifica si el cursoId es correcto
    console.log('Usuario ID:', usuarioId); // Verifica si el usuarioId es correcto

    const query = `
      SELECT fecha, asistencia 
      FROM asistencias 
      WHERE curso_id = ? AND usuario_id = ?
    `;

    connection.query(query, [cursoId, usuarioId], (err, results) => {
        if (err) {
            console.error('Error al obtener las asistencias:', err);
            res.status(500).send('Error al obtener las asistencias');
        } else {
            console.log('Resultados de asistencias:', results); // Log para verificar el resultado
            res.json(results);
        }
    });
});

// Ruta para recibir los datos de la encuesta
app.post('/api/encuesta', (req, res) => {
    const { id_inscripcion, respuestas1, respuestas2, respuestas3, respuestas4, respuestas5, sugerencias } = req.body;

    // Construir una consulta SQL para insertar los datos
    const query = `
  INSERT INTO encuestas (id_inscripcion, respuestas_seccion1, respuestas_seccion2, respuestas_seccion3, respuestas_seccion4, respuestas_seccion5, sugerencias)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;

    const values = [
        id_inscripcion,
        JSON.stringify(respuestas1),
        JSON.stringify(respuestas2),
        JSON.stringify(respuestas3),
        JSON.stringify(respuestas4),
        JSON.stringify(respuestas5),
        sugerencias
    ];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al guardar la encuesta:', error);
            res.status(500).json({ message: 'Error al guardar la encuesta' });
        } else {
            res.status(200).json({ message: 'Encuesta guardada exitosamente' });
        }
    });
});

// Nueva ruta para obtener el id_inscripcion
app.get('/api/inscripcion/:cursoId/:usuarioId', (req, res) => {
    const cursoId = req.params.cursoId;
    const usuarioId = req.params.usuarioId;

    const query = `
        SELECT id FROM inscripciones 
        WHERE usuario_id = ? AND curso_id = ? LIMIT 1
    `;

    connection.query(query, [usuarioId, cursoId], (error, results) => {
        if (error) {
            console.error('Error al obtener id_inscripcion:', error);
            res.status(500).json({ message: 'Error al obtener id_inscripcion' });
        } else if (results.length > 0) {
            res.status(200).json({ id: results[0].id });
        } else {
            res.status(404).json({ message: 'Inscripción no encontrada' });
        }
    });
});

// Definición de la ruta en Express.js
app.get('/api/encuesta/respondida/:idInscripcion', verificarEncuestaRespondida);

// Esta función manejará la verificación de la encuesta
function verificarEncuestaRespondida(req, res) {
    const { idInscripcion } = req.params;

    // Realiza la consulta para verificar si la encuesta fue respondida
    const query = 'SELECT COUNT(*) AS respondida FROM respuestas WHERE id_inscripcion = ?';

    connection.query(query, [idInscripcion], (err, results) => {
        if (err) {
            console.error('Error al verificar la respuesta:', err);
            return res.status(500).json({ message: 'Error al verificar la respuesta' });
        }

        // Comprueba si la encuesta fue respondida
        const respondida = results[0].respondida > 0;
        res.json({ respondida });
    });
}

// Función para verificar si la encuesta ya fue respondida
function verificarEncuestaRespondida(req, res) {
    const { idInscripcion } = req.params;

    // Cambia 'respuestas' por 'encuestas'
    const query = 'SELECT COUNT(*) AS respondida FROM encuestas WHERE id_inscripcion = ?';

    connection.query(query, [idInscripcion], (err, results) => {
        if (err) {
            console.error('Error al verificar la respuesta:', err);
            return res.status(500).json({ message: 'Error al verificar la respuesta', error: err.message });
        }

        const respondida = results[0].respondida > 0;
        res.json({ respondida });
    });
}
// Ruta para guardar calificaciones
app.post('/curso/:id/guardar-calificacion', (req, res) => {
    const cursoId = req.params.id;
    const { usuario_id, calificacion } = req.body;

    // Verificar si ya existe una calificación para este usuario en el curso
    const checkQuery = 'SELECT * FROM calificaciones WHERE curso_id = ? AND usuario_id = ?';

    connection.query(checkQuery, [cursoId, usuario_id], (err, results) => {
        if (err) {
            console.error('Error al verificar la calificación existente:', err);
            return res.status(500).json({ error: 'Error al verificar la calificación existente.' });
        }

        if (results.length > 0) {
            // Si ya existe una calificación
            return res.status(400).json({ message: 'El maestro ya tiene una calificación para este curso.' });
        }

        // Insertar la nueva calificación
        const insertCalificacionQuery = 'INSERT INTO calificaciones (curso_id, usuario_id, calificacion) VALUES (?, ?, ?)';

        connection.query(insertCalificacionQuery, [cursoId, usuario_id, calificacion], (err, results) => {
            if (err) {
                console.error('Error al guardar la calificación:', err);
                return res.status(500).json({ error: 'Error al guardar la calificación.' });
            }

            // Si la calificación es mayor o igual a 7, actualizar la tabla usuario_requisitos
            if (calificacion >= 7) {
                const updateRequisitosQuery = `
                    UPDATE usuario_requisitos 
                    SET calificacion = 1 
                    WHERE curso_id = ? AND usuario_id = ?
                `;

                connection.query(updateRequisitosQuery, [cursoId, usuario_id], (err, updateResult) => {
                    if (err) {
                        console.error('Error al actualizar usuario_requisitos:', err);
                        return res.status(500).json({ error: 'Error al actualizar usuario_requisitos.' });
                    }
                    res.status(200).json({ message: 'Calificación guardada y requisitos actualizados exitosamente.' });
                });
            } else {
                // Si la calificación es menor a 7, solo guardar la calificación
                res.status(200).json({ message: 'Calificación guardada exitosamente.' });
            }
        });
    });
});

// Ruta para verificar si ya existe una calificación
app.get('/curso/:id/calificaciones', (req, res) => {
    const cursoId = req.params.id;
    const usuarioId = req.query.usuario_id;

    const query = 'SELECT * FROM calificaciones WHERE curso_id = ? AND usuario_id = ?';
    connection.query(query, [cursoId, usuarioId], (err, results) => {
        if (err) {
            console.error('Error al verificar la calificación:', err);
            return res.status(500).json({ error: 'Error al verificar la calificación.' });
        }
        res.status(200).json({ existe: results.length > 0 });
    });
});
app.get('/curso/:cursoId/calificacion/:usuarioId', (req, res) => {
    const { cursoId, usuarioId } = req.params;

    // Lógica para obtener la calificación del usuario en el curso
    const query = 'SELECT calificacion FROM calificaciones WHERE curso_id = ? AND usuario_id = ?';

    connection.query(query, [cursoId, usuarioId], (err, results) => {
        if (err) {
            console.error('Error al obtener la calificación:', err);
            return res.status(500).json({ error: 'Error al obtener la calificación.' });
        }
        if (results.length > 0) {
            res.status(200).json({ calificacion: results[0].calificacion });
        } else {
            res.status(404).json({ error: 'Calificación no encontrada.' });
        }
    });
});
// Ruta para obtener los cursos propuestos por un jefe específico
app.get('/jefe/:idJefe/cursos', (req, res) => {
    const idJefe = req.params.idJefe;
    console.log(`ID del jefe recibido: ${idJefe}`);

    // Consulta SQL para obtener los IDs de los cursos asociados al jefe en `jefe_curso`
    const sqlJefeCurso = `
        SELECT id_curso 
        FROM jefe_curso 
        WHERE id_jefe = ?;
    `;

    connection.query(sqlJefeCurso, [idJefe], (error, results) => {
        if (error) {
            console.error('Error al obtener los IDs de cursos:', error);
            return res.status(500).json({ error: 'Error al obtener los IDs de cursos' });
        }

        // Extraemos los IDs de los cursos en un array
        const cursoIds = results.map(row => row.id_curso);

        // Si no hay cursos asociados, devolvemos un array vacío
        if (cursoIds.length === 0) {
            return res.json([]);
        }

        // Consulta SQL para obtener los detalles de los cursos en `cursos_propuestos` usando los IDs obtenidos
        const sqlCursosPropuestos = `
            SELECT * 
            FROM cursos_propuestos 
            WHERE id IN (?);
        `;

        connection.query(sqlCursosPropuestos, [cursoIds], (error, cursos) => {
            if (error) {
                console.error('Error al obtener los cursos propuestos:', error);
                return res.status(500).json({ error: 'Error al obtener los cursos propuestos' });
            }
            console.log('Cursos propuestos:', cursos);
            res.json(cursos);
        });
    });
});
// Ruta para guardar la encuesta
app.post('/api/encuesta/guardar', (req, res) => {
    const { usuarioId, cursoId, idMaestro, respuestas, sugerencias } = req.body;

    console.log('Valores obtenidos:', { usuarioId, cursoId, idMaestro, respuestas, sugerencias });

    // Consulta para obtener `jefe_curso_id`
    const jefeCursoQuery = 'SELECT id FROM jefe_curso WHERE id_jefe = ? AND id_curso = ?';
    connection.query(jefeCursoQuery, [usuarioId, cursoId], (err, jefeCursoResult) => {
        if (err) {
            console.error('Error al obtener jefe_curso_id:', err);
            return res.status(500).json({ error: 'Error al obtener jefe_curso_id' });
        }

        const jefeCursoId = jefeCursoResult.length ? jefeCursoResult[0].id : null;
        if (!jefeCursoId) {
            return res.status(404).json({ error: 'Jefe_curso no encontrado' });
        }

        // Consulta para obtener `inscripcion_id`
        const inscripcionQuery = 'SELECT id FROM inscripciones WHERE usuario_id = ? AND curso_id = ?';
        connection.query(inscripcionQuery, [idMaestro, cursoId], (err, inscripcionResult) => {
            if (err) {
                console.error('Error al obtener inscripcion_id:', err);
                return res.status(500).json({ error: 'Error al obtener inscripcion_id' });
            }

            const inscripcionId = inscripcionResult.length ? inscripcionResult[0].id : null;
            if (!inscripcionId) {
                return res.status(404).json({ error: 'Inscripción no encontrada' });
            }

            // Verificar si el usuario ya ha respondido la encuesta
            const checkSurveyQuery = 'SELECT id FROM encuesta_jefe WHERE jefe_curso_id = ? AND inscripcion_id = ?';
            connection.query(checkSurveyQuery, [jefeCursoId, inscripcionId], (err, surveyResult) => {
                if (err) {
                    console.error('Error al verificar encuesta:', err);
                    return res.status(500).json({ error: 'Error al verificar encuesta' });
                }

                // Si ya existe un registro, no se permite enviar la encuesta nuevamente
                if (surveyResult.length > 0) {
                    return res.status(400).json({ error: 'La encuesta ya ha sido respondida' });
                }

                // Insertar la encuesta en `encuesta_jefe`
                const insertQuery = `
                    INSERT INTO encuesta_jefe (jefe_curso_id, inscripcion_id, respuestas_seccion1, sugerencias, fecha)
                    VALUES (?, ?, ?, ?, NOW())
                `;
                connection.query(insertQuery, [jefeCursoId, inscripcionId, JSON.stringify(respuestas), sugerencias], (err, result) => {
                    if (err) {
                        console.error('Error al guardar la encuesta:', err);
                        return res.status(500).json({ error: 'Error al guardar la encuesta' });
                    }

                    res.status(200).json({ message: 'Encuesta guardada exitosamente' });
                });
            });
        });
    });
});

// Ruta para obtener el ID del curso basado en nombre y estado
app.get('/api/encuesta/obtenerCursoId', (req, res) => {
    const nombreCurso = req.query.nombre_curso;
    const estado = req.query.estado;

    if (!nombreCurso || !estado) {
        return res.status(400).json({ error: 'Faltan parámetros' });
    }

    const query = 'SELECT id FROM cursos_propuestos WHERE nombre_curso = ? AND estado = ? LIMIT 1';
    connection.query(query, [nombreCurso, estado], (error, results) => {
        if (error) {
            console.error('Error al obtener el ID del curso:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        if (results.length > 0) {
            res.json({ id: results[0].id });
        } else {
            res.status(404).json({ error: 'Curso no encontrado' });
        }
    });
});
//CONSTANCIA DESCARGAR
app.get('/requisitos/:usuarioId/:cursoId', (req, res) => {
    const { usuarioId, cursoId } = req.params;

    connection.query(
        'SELECT asistencias, calificacion, evidencias, encuesta1, encuestajefes FROM usuario_requisitos WHERE usuario_id = ? AND curso_id = ?',
        [usuarioId, cursoId],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener los requisitos' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'No se encontraron requisitos' });
            }
            res.json(results[0]);
        }
    );
});

// Ruta para verificar asistencias y actualizar usuario_requisitos
app.post('/curso/:id/verificar-asistencias', (req, res) => {
    const cursoId = req.params.id;
    const { usuario_id } = req.body;

    // Consulta para contar la asistencia total y las asistencias registradas del usuario en el curso
    const totalAsistenciasQuery = 'SELECT COUNT(*) AS total FROM asistencias WHERE curso_id = ?';
    const usuarioAsistenciasQuery = 'SELECT COUNT(*) AS asistenciasUsuario FROM asistencias WHERE curso_id = ? AND usuario_id = ? AND asistencia = 1';

    connection.query(totalAsistenciasQuery, [cursoId], (err, totalResults) => {
        if (err) {
            console.error('Error al obtener el total de asistencias:', err);
            return res.status(500).json({ error: 'Error al obtener el total de asistencias.' });
        }

        const totalAsistencias = totalResults[0].total;

        connection.query(usuarioAsistenciasQuery, [cursoId, usuario_id], (err, usuarioResults) => {
            if (err) {
                console.error('Error al obtener las asistencias del usuario:', err);
                return res.status(500).json({ error: 'Error al obtener las asistencias del usuario.' });
            }

            const asistenciasUsuario = usuarioResults[0].asistenciasUsuario;
            const porcentajeAsistencias = (asistenciasUsuario / totalAsistencias) * 100;
            const cumplioAsistencias = porcentajeAsistencias >= 80 ? 1 : 0;

            // Actualizar el campo `asistencias` en la tabla usuario_requisitos
            const updateQuery = 'UPDATE usuario_requisitos SET asistencias = ? WHERE curso_id = ? AND usuario_id = ?';
            connection.query(updateQuery, [cumplioAsistencias, cursoId, usuario_id], (err, updateResults) => {
                if (err) {
                    console.error('Error al actualizar asistencias en usuario_requisitos:', err);
                    return res.status(500).json({ error: 'Error al actualizar asistencias en usuario_requisitos.' });
                }

                res.status(200).json({ message: 'Asistencias verificadas y actualizadas correctamente.', cumplioAsistencias });
            });
        });
    });
});
// Ruta para registrar la encuesta como completada
// Ruta para actualizar la encuesta
app.post('/api/encuesta/actualizar-encuesta/:usuarioId/:cursoId', (req, res) => {
    const { usuarioId, cursoId } = req.params;

    // Consulta para actualizar el campo encuesta1
    const query = 'UPDATE usuario_requisitos SET encuesta1 = 1 WHERE usuario_id = ? AND curso_id = ?';

    connection.query(query, [usuarioId, cursoId], (err, result) => {
        if (err) {
            console.error('Error al actualizar encuesta:', err);
            return res.status(500).json({ message: 'Error al actualizar encuesta', error: err });
        }

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Encuesta registrada correctamente' });
        } else {
            res.status(404).json({ message: 'No se encontró el registro para actualizar' });
        }
    });
});
//Encuesta jefes actualizar requisitos
app.post('/api/encuesta/actualizarEncuestaJefes', (req, res) => {
    const { idMaestro, cursoId } = req.body;
    console.log('Datos recibidos:', { idMaestro, cursoId }); // Log para verificar

    const query = 'UPDATE usuario_requisitos SET encuestajefes = 1 WHERE usuario_id = ? AND curso_id = ?';

    connection.query(query, [idMaestro, cursoId], (error, result) => {
        if (error) {
            console.error('Error al actualizar encuestajefes:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        console.log('Resultado de la actualización:', result);
        res.json({ message: 'Encuesta de jefes actualizada correctamente' });
    });
});

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const uploadDir = path.join(__dirname, 'uploads');

// Crear la carpeta 'uploads' si no existe
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log('Carpeta "uploads" creada');
}

// Configuración de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Ruta para subir archivos y actualizar encuestajefes en usuario_requisitos
app.post('/uploads', upload.single('archivo'), (req, res) => {
    const archivo = req.file;
    const usuarioId = req.body.usuarioId;
    const cursoId = req.body.cursoId;

    if (!archivo) {
        return res.status(400).json({ error: 'No se ha subido ningún archivo' });
    }
    if (!usuarioId || !cursoId) {
        return res.status(400).json({ error: 'ID de usuario o curso no válidos.' });
    }

    // Leer el archivo y guardar en la base de datos
    const archivoData = fs.readFileSync(archivo.path);
    const sqlInsertArchivo = 'INSERT INTO archivos (nombre_archivo, archivo, curso_id, instructor_id) VALUES (?, ?, ?, ?)';
    const values = [archivo.originalname, archivoData, cursoId, usuarioId];

    // Insertar archivo y luego actualizar encuestajefes en usuario_requisitos
    connection.query(sqlInsertArchivo, values, (err, result) => {
        if (err) {
            console.error('Error al guardar el archivo en la base de datos:', err.message);
            return res.status(500).send('Error al guardar el archivo en la base de datos.');
        }

        // Buscar usuarios asociados al curso y actualizar encuestajefes
        const sqlObtenerUsuarios = `
            SELECT ur.usuario_id
            FROM usuario_requisitos AS ur
            JOIN instructor_curso AS ic ON ur.curso_id = ic.id_curso_propuesto
            WHERE ic.id_usuario_instructor = ? AND ur.curso_id = ?`;

        connection.query(sqlObtenerUsuarios, [usuarioId, cursoId], (err, usuarios) => {
            if (err) {
                console.error('Error al buscar los usuarios para actualizar encuestajefes:', err.message);
                return res.status(500).send('Error al buscar los usuarios.');
            }

            if (usuarios.length === 0) {
                return res.status(404).json({ error: 'No se encontraron usuarios para actualizar.' });
            }

            // Actualizar encuestajefes a 1 para cada usuario encontrado
            const idsUsuarios = usuarios.map(user => user.usuario_id);
            const sqlActualizarEncuestajefes = `
                UPDATE usuario_requisitos
                SET evidencias = 1
                WHERE curso_id = ? AND usuario_id IN (?)`;

            connection.query(sqlActualizarEncuestajefes, [cursoId, idsUsuarios], (err) => {
                if (err) {
                    console.error('Error al actualizar encuestajefes en usuario_requisitos:', err.message);
                    return res.status(500).send('Error al actualizar encuestajefes.');
                }
                res.status(200).send('Archivo subido y encuestajefes actualizado exitosamente.');
            });
        });
    });
});
app.get('/asistencias/count/:usuarioId/:cursoId', (req, res) => {
    const { usuarioId, cursoId } = req.params;
    const query = `
      SELECT COUNT(*) AS totalAsistencias,
             SUM(asistencia) AS asistenciasCompletas
      FROM asistencias
      WHERE usuario_id = ? AND curso_id = ?
    `;

    connection.query(query, [usuarioId, cursoId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al contar asistencias' });
        }
        res.json(results[0]);
    });
});

app.put('/usuario_requisitos/:usuarioId/:cursoId', (req, res) => {
    const { usuarioId, cursoId } = req.params;
    const { asistencias } = req.body;
    const query = `
      UPDATE usuario_requisitos 
      SET asistencias = ? 
      WHERE usuario_id = ? AND curso_id = ?
    `;

    connection.query(query, [asistencias, usuarioId, cursoId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al actualizar los requisitos' });
        }
        res.json({ message: 'Requisitos actualizados correctamente' });
    });
});

// Ruta para obtener archivos por curso_id
app.get('/archivos/curso/:cursoId', (req, res) => {
    const cursoId = req.params.cursoId;
    const sql = 'SELECT * FROM archivos WHERE curso_id = ?';

    connection.query(sql, [cursoId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener archivos' });
        }
        res.json(results);
    });
});
// Ruta para descargar un archivo por su ID
app.get('/archivos/download/:id', (req, res) => {
    const id = req.params.id;

    const query = 'SELECT nombre_archivo, archivo FROM archivos WHERE id = ?';

    connection.query(query, [id], (error, results) => {
        if (error) {
            return res.status(500).send('Error al obtener el archivo');
        }

        if (results.length === 0) {
            return res.status(404).send('Archivo no encontrado');
        }

        const archivo = results[0];

        // Asegúrate de que solo se envíen los encabezados una vez
        res.setHeader('Content-Disposition', `attachment; filename="${archivo.nombre_archivo}"`);
        res.setHeader('Content-Type', 'application/octet-stream');

        // Envío del archivo
        res.send(archivo.archivo);
    });
});
app.get('/descargar-curso/:id', (req, res) => {
    const cursoId = req.params.id;
    const query = 'SELECT * FROM cursos_propuestos WHERE id = ?'; // Filtra por el ID del curso

    connection.query(query, [cursoId], (error, results) => {
        if (error) {
            return res.status(500).send('Error al consultar la base de datos');
        }

        if (results.length === 0) {
            return res.status(404).send('Curso no encontrado');
        }

        // Crea el contenido CSV
        const curso = results[0]; // Obtén el primer (y único) resultado
        let csv = 'id,nombre_curso,asignaturas_requeridas,contenidos_requeridos,numero_docentes,tipo_asignatura,actividad_evento,carreras_atendidas,periodo,turno,fecha_inicio,fecha_fin,nombre_instructor,apellidopaterno_instructor,apellidomaterno_instructor,curp_instructor,rfc_instructor,maxestudios_instructor,email_instructor,sexo_instructor,tipo_contrato_instructor\n';

        // Asegúrate de que las propiedades coincidan con las de tu tabla
        csv += `${curso.id},${curso.nombre_curso},${curso.asignaturas_requeridas},${curso.contenidos_requeridos},${curso.numero_docentes},${curso.tipo_asignatura},${curso.actividad_evento},${curso.carreras_atendidas},${curso.periodo},${curso.turno},${curso.fecha_inicio},${curso.fecha_fin},${curso.nombre_instructor},${curso.apellidopaterno_instructor},${curso.apellidomaterno_instructor},${curso.curp_instructor},${curso.rfc_instructor},${curso.maxestudios_instructor},${curso.email_instructor},${curso.sexo_instructor},${curso.tipo_contrato_instructor}\n`;

        // Configura los encabezados para la descarga del archivo
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${curso.nombre_curso}_DATOS.csv"`); // El nombre del archivo
        res.status(200).send(csv);
    });
});
app.get('/descargar2-curso/:id', (req, res) => {
    const cursoId = req.params.id;
    const query = 'SELECT * FROM cursos_propuestos WHERE id = ?'; // Filtra por el ID del curso

    connection.query(query, [cursoId], (error, results) => {
        if (error) {
            return res.status(500).send('Error al consultar la base de datos');
        }

        if (results.length === 0) {
            return res.status(404).send('Curso no encontrado');
        }

        // Crea el contenido CSV
        const curso = results[0]; // Obtén el primer (y único) resultado
        let csv = 'id,nombre_curso,objetivo,justificacion,fecha_inicio,fecha_fin,numero_horas,horario,lugar,requisitos,nombre_instructor,apellidopaterno_instructor,apellidomaterno_instructor\n';

        // Asegúrate de que las propiedades coincidan con las de tu tabla
        csv += `${curso.id},${curso.nombre_curso},${curso.objetivo},${curso.justificacion},${curso.fecha_inicio},${curso.fecha_fin},${curso.numero_horas},${curso.horario},${curso.lugar},${curso.requisitos},${curso.nombre_instructor},${curso.apellidopaterno_instructor},${curso.apellidomaterno_instructor}\n`;

        // Configura los encabezados para la descarga del archivo
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${curso.nombre_curso}_DATOS.csv"`); // El nombre del archivo
        res.status(200).send(csv);
    });
});

const { Parser } = require('json2csv'); // Necesario para exportar a CSV
// Preguntas para cada sección
const preguntasSeccion1 = [
    'PERMITIÓ QUE LOS CONOCIMIENTOS ADQUIRIDOS TENGAN APLICACIÓN EN MI ÁMBITO LABORAL A CORTO Y MEDIANO PLAZO.',
    'AYUDÓ A MEJORAR EL DESEMPEÑO DE MIS FUNCIONES.',
    'AYUDÓ A CONSIDERAR NUEVAS FORMAS DE TRABAJO.',
    'PRODUJO UN INCREMENTO EN MI MOTIVACIÓN.',
    'HA SERVIDO PARA MI DESARROLLO PROFESIONAL.',
    'SIRVIÓ PARA INTEGRARME MEJOR CON MIS COMPAÑEROS(AS) DE TRABAJO.',
    'PRODUJO UNA MAYOR COMPRENSIÓN DEL SERVICIO QUE PRESTO EN EL ITA.',
    'FACILITÓ UNA MEJORÍA EN MI ACTITUD HACIA LA INSTITUCIÓN O MIS COMPAÑEROS(AS) DE TRABAJO.',
    'PERMITIÓ QUE DESARROLLARA ALGUNAS HABILIDADES ADICIONALES.',
    'GENERÓ UNA MEJOR COMPRENSIÓN DE LOS CONCEPTOS GENERALES DEL CURSO APLICABLES A MI CAMPO LABORAL.',
    'RELACIONÉ LOS CONOCIMIENTOS IMPARTIDOS DEL CURSO CON LA DOCENCIA.',
    'OFRECIERON UN SENTIDO ÉTICO Y MORAL PARA MEJORAR MIS ASPECTOS LABORALES.',
    'OFRECIERON VALORES COMPATIBLES CON LOS MÍOS.'
];

const preguntasSeccion2 = [
    'EXPUSO EL OBJETIVO Y TEMARIO DEL CURSO',
    'MOSTRÓ DOMINIO DEL CONTENIDO ABORDADO.',
    'FOMENTÓ LA PARTICIPACIÓN DEL GRUPO.',
    'ACLARÓ LAS DUDAS QUE SE PRESENTARON.',
    'DIÓ RETROALIMENTACIÓN A LOS EJERCICIOS REALIZADOS.',
    'APLICÓ UNA EVALUACIÓN FINAL RELACIONADA CON LOS CONTENIDOS DEL CURSO.',
    'INICIÓ Y CONCLUYÓ PUNTUALMENTE A LAS SESIONES.'
];

const preguntasSeccion3 = [
    'EL MATERIAL DIDÁCTICO FUE ÚTIL A LO LARGO DEL CURSO.',
    'LA VARIEDAD DE MATERIAL DIDÁCTICO FUE SUFICIENTE PARA APOYAR SU APRENDIZAJE.'
];

const preguntasSeccion4 = [
    'LA DISTRIBUCIÓN DEL TIEMPO FUE ADECUADA PARA CUBRIR EL CONTENIDO.',
    'LOS TEMAS FUERON SUFICIENTES PARA ALCANZAR EL OBJETIVO DEL CURSO.',
    'EL CURSO COMPRENDIÓ EJERCICIOS DE PRÁCTICA RELACIONADOS CON EL CONTENIDO.',
    'EL CURSO CUBRIÓ MIS EXPECTATIVAS.'
];

app.get('/descargar-encuestas/:cursoId', (req, res) => {
    const cursoId = req.params.cursoId;

    connection.query('SELECT id FROM inscripciones WHERE curso_id = ?', [cursoId], (err, inscripciones) => {
        if (err) {
            console.error('Error al obtener inscripciones:', err);
            return res.status(500).send('Error al obtener inscripciones.');
        }

        const idsInscripcion = inscripciones.map(inscripcion => inscripcion.id);

        if (!idsInscripcion.length) {
            return res.status(404).send('No se encontraron inscripciones para este curso.');
        }

        connection.query('SELECT * FROM encuestas WHERE id_inscripcion IN (?)', [idsInscripcion], (err, encuestas) => {
            if (err) {
                console.error('Error al obtener encuestas:', err);
                return res.status(500).send('Error al obtener encuestas.');
            }

            if (!encuestas.length) {
                return res.status(404).send('No se encontraron encuestas para estas inscripciones.');
            }

            const encuestasTransformadas = encuestas.map(encuesta => {
                const respuestasSeccion1 = encuesta.respuestas_seccion1 || [];
                const respuestasSeccion2 = encuesta.respuestas_seccion2 || [];
                const respuestasSeccion3 = encuesta.respuestas_seccion3 || [];
                const respuestasSeccion4 = encuesta.respuestas_seccion4 || [];

                const seccion1 = respuestasSeccion1.map((respuesta, index) => ({
                    pregunta: preguntasSeccion1[index] || `Pregunta ${index + 1}`,
                    respuesta: respuesta
                }));

                const seccion2 = respuestasSeccion2.map((respuesta, index) => ({
                    pregunta: preguntasSeccion2[index] || `Pregunta ${index + 1}`,
                    respuesta: respuesta
                }));

                const seccion3 = respuestasSeccion3.map((respuesta, index) => ({
                    pregunta: preguntasSeccion3[index] || `Pregunta ${index + 1}`,
                    respuesta: respuesta
                }));

                const seccion4 = respuestasSeccion4.map((respuesta, index) => ({
                    pregunta: preguntasSeccion4[index] || `Pregunta ${index + 1}`,
                    respuesta: respuesta
                }));

                return {
                    id: encuesta.id,
                    id_inscripcion: encuesta.id_inscripcion,
                    seccion1: seccion1,
                    seccion2: seccion2,
                    seccion3: seccion3,
                    seccion4: seccion4,
                    sugerencias: encuesta.sugerencias,
                    fecha: encuesta.fecha
                };
            });

            const csvData = encuestasTransformadas.flatMap(encuesta =>
                encuesta.seccion1.map(item => ({
                    id: encuesta.id,
                    id_inscripcion: encuesta.id_inscripcion,
                    pregunta: item.pregunta,
                    respuesta: item.respuesta,
                    seccion: 'Sección 1'
                })).concat(
                    encuesta.seccion2.map(item => ({
                        id: encuesta.id,
                        id_inscripcion: encuesta.id_inscripcion,
                        pregunta: item.pregunta,
                        respuesta: item.respuesta,
                        seccion: 'Sección 2'
                    })),
                    encuesta.seccion3.map(item => ({
                        id: encuesta.id,
                        id_inscripcion: encuesta.id_inscripcion,
                        pregunta: item.pregunta,
                        respuesta: item.respuesta,
                        seccion: 'Sección 3'
                    })),
                    encuesta.seccion4.map(item => ({
                        id: encuesta.id,
                        id_inscripcion: encuesta.id_inscripcion,
                        pregunta: item.pregunta,
                        respuesta: item.respuesta,
                        seccion: 'Sección 4'
                    }))
                )
            );

            const fields = ['id', 'id_inscripcion', 'pregunta', 'respuesta', 'seccion'];
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(csvData);

            // Agregar BOM para UTF-8
            const csvWithBOM = '\uFEFF' + csv;

            res.header('Content-Type', 'text/csv; charset=utf-8');
            res.attachment(`encuestas_curso_${cursoId}.csv`);
            res.send(csvWithBOM);
        });
    });
});
// Define las preguntas al inicio del archivo
const preguntas = [
    'LOS CONOCIMIENTOS QUE ADQUIRIÓ SU COLABORADOR(A) EN EL CURSO TIENE APLICACIÓN EN EL ÁMBITO LABORAL A CORTO Y MEDIANO PLAZO.',
    'EL CURSO AYUDÓ A SU COLABORADOR(A) A MEJORAR EL DESEMPEÑO DE SUS FUNCIONES.',
    'EL CURSO AYUDÓ A SU COLABORADOR(A) A CONSIDERAR NUEVAS FORMAS DE TRABAJO.',
    'PRODUJO UN INCREMENTO EN SU MOTIVACIÓN.',
    'HA SERVIDO PARA SU DESARROLLO PERSONAL.',
    'SIRVIÓ PARA INTEGRARME MEJOR CON SUS COMPAÑEROS(AS) DE TRABAJO.',
    'PRODUJO UNA MAYOR COMPRENSIÓN DEL SERVICIO QUE PRESTA EL SNEST.',
    'FACILITÓ UNA MEJORÍA EN SU ACTITUD HACIA LA INSTITUCIÓN O SUS COMPAÑEROS(AS) DE TRABAJO.',
    'PERMITIÓ QUE DESARROLLARA ALGUNAS HABILIDADES ADICIONALES.',
    'GENERÓ UNA MEJOR COMPRENSIÓN DE LOS CONCEPTOS GENERALES DEL CURSO APLICABLES A SU CAMPO LABORAL.',
    'RELACIONARON LOS CONOCIMIENTOS IMPARTIDOS DEL CURSO CON LA DOCENCIA.',
    'OFRECIERON UN SENTIDO ÉTICO Y MORAL PARA MEJORAR SUS ASPECTOS LABORALES.',
    'OFRECIERON VALORES COMPATIBLES CON LOS SUYOS.'
];

// Luego, define tu ruta
app.get('/descargar-encuestas-jefe/:cursoId', (req, res) => {
    const cursoId = req.params.cursoId;

    // Primero, obtenemos las inscripciones para el curso
    connection.query('SELECT id FROM inscripciones WHERE curso_id = ?', [cursoId], (err, inscripciones) => {
        if (err) {
            console.error('Error al obtener inscripciones:', err);
            return res.status(500).send('Error al obtener inscripciones.');
        }

        const idsInscripcion = inscripciones.map(inscripcion => inscripcion.id);

        if (!idsInscripcion.length) {
            return res.status(404).send('No se encontraron inscripciones para este curso.');
        }

        // Ahora obtenemos las encuestas para esos ids de inscripción
        connection.query('SELECT * FROM encuesta_jefe WHERE inscripcion_id IN (?)', [idsInscripcion], (err, encuestas) => {
            if (err) {
                console.error('Error al obtener encuestas de jefe:', err);
                return res.status(500).send('Error al obtener encuestas de jefe.');
            }

            if (!encuestas.length) {
                return res.status(404).send('No se encontraron encuestas de jefe para estas inscripciones.');
            }

            // Transformamos los datos de las encuestas
            const encuestasTransformadas = encuestas.map(encuesta => {
                const respuestasSeccion1 = encuesta.respuestas_seccion1 || [];

                // Crear secciones con preguntas y respuestas
                const seccion1 = respuestasSeccion1.map((respuesta, index) => ({
                    pregunta: preguntas[index] || `Pregunta ${index + 1}`,
                    respuesta: respuesta
                }));

                return {
                    id: encuesta.id,
                    inscripcion_id: encuesta.inscripcion_id,
                    seccion1: seccion1,
                    sugerencias: encuesta.sugerencias,
                    fecha: encuesta.fecha
                };
            });

            // Preparar el CSV
            const csvData = encuestasTransformadas.flatMap(encuesta =>
                encuesta.seccion1.map(item => ({
                    id: encuesta.id,
                    inscripcion_id: encuesta.inscripcion_id,
                    pregunta: item.pregunta,
                    respuesta: item.respuesta,
                    seccion: 'Sección 1'
                }))
            );

            const fields = ['id', 'inscripcion_id', 'pregunta', 'respuesta', 'seccion'];
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(csvData);

            // Agregar BOM para UTF-8
            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="Encuestas_Jefe_${cursoId}.csv"`);
            res.send('\uFEFF' + csv); // Enviar CSV con BOM
        });
    });
});

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});