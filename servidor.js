const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Para permitir peticiones desde el frontend
const app = express();

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

// Ruta para obtener la lista de maestros
app.get('/maestros', (req, res) => {
    connection.query('SELECT nombre, telefono FROM maestros', (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching data');
        }
        res.json(results);
    });
});

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
