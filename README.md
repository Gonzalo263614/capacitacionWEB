# Capacitación Web

## Descripción

Este proyecto es una aplicación para gestionar la capacitación de docentes. Incluye un backend desarrollado con Node.js y Express y un frontend desarrollado con Angular. El sistema está diseñado para ejecutarse en una red local.

---------------------------------------------------------------------------------------------

### Requisitos previos

Antes de instalar y ejecutar el proyecto, asegúrate de tener las siguientes herramientas instaladas:

1. **Node.js**: Versiones **14 o superior**. Puedes descargarlo desde [Node.js](https://nodejs.org/).

2. **npm**: Versiones **6 o superior**. npm viene incluido con Node.js.

3. **MySQL**: Versiones **5.7 o superior**. Descarga e instala MySQL desde [MySQL Community Downloads](https://dev.mysql.com/downloads/mysql/).

---------------------------------------------------------------------------------------------

### Pasos para desplegar el backend

1. **Configuración de la base de datos**:
   - Asegúrate de que el servidor MySQL esté en ejecución.
   - Crea una base de datos llamada `capacitacionDB`.
   - Importa el archivo SQL que se encuentra en el directorio `resources` del proyecto.

2. **Instalación del backend**:
   - Navega al directorio del proyecto:
     ```bash
     cd capacitacionWEB/backend
     ```
   - Instala las dependencias necesarias:
     ```bash
     npm install
     ```
## Dependencias

Estas son las dependencias utilizadas en el proyecto:

- **bcrypt** (`^5.1.1`): Para encriptar contraseñas y asegurar datos sensibles.
- **cors** (`^2.8.5`): Middleware para habilitar accesos entre dominios (CORS).
- **express** (`^4.19.2`): Framework web para construir el backend.
- **json2csv** (`^6.0.0-alpha.2`): Para exportar datos en formato CSV.
- **jsonwebtoken** (`^9.0.2`): Manejo de autenticación y autorización basada en JWT.
- **multer** (`^1.4.5-lts.1`): Middleware para manejar la subida de archivos.
- **mysql2** (`^3.11.0`): Para manejar la conexión con la base de datos MySQL.

Ejecuta el siguiente comando para instalar todas las dependencias necesarias:
```bash
npm install
---------------------------------------------------------------------------------------------
3. **Cambios necesarios en el código del backend para el despliegue en red local**:
   Archivo 'Servidor.js'
   #### Conexión a la base de datos MySQL
   
   **ANTES**:
   ```javascript
   const connection = mysql.createConnection({
       host: 'localhost', // Cambia aquí si el MySQL no está en la misma máquina
       user: 'root',
       password: 'Contraseña2190.', // Usa tu contraseña
       database: 'capacitacionDB'
   });
   ```
   
   **DESPUÉS**:
   ```javascript
   const connection = mysql.createConnection({
       host: '192.168.x.x', // Sustituye con la IP del servidor MySQL
       user: 'root',
       password: 'Contraseña2190.', // Usa tu contraseña
       database: 'capacitacionDB'
   });
   ```
   - Cambia `192.168.x.x` por la dirección IP del servidor MySQL dentro de la red local.

   #### Configuración del servidor para escuchar en todas las interfaces de red
   
   **ANTES**:
   ```javascript
   const PORT = 3000;
   app.listen(PORT, () => {
       console.log(`Server is running on port ${PORT}`);
   });
   ```
   
   **DESPUÉS**:
   ```javascript
   const PORT = 3000;
   const HOST = '0.0.0.0'; // Escuchar en todas las interfaces de red

   app.listen(PORT, HOST, () => {
       console.log(`Server is running on http://${HOST}:${PORT}`);
   });
   ```

   - Esto permite que el backend sea accesible desde cualquier equipo en la red local.

4. **Inicia el servidor**:
   ```bash
   node servidor.js
   ```
   Si todo está correctamente configurado, deberías ver:
   ```
   Server is running on http://0.0.0.0:3000
   Connected to capacitacionDB
   ```

--------------------------------------------------------------------------------------------------------

## Instrucciones para desplegar el frontend

### Pasos para desplegar el frontend

1. **Instalación del frontend**:
   - Navega al directorio del frontend:
     ```bash
     cd capacitacionWEB/frontend
     ```
   - Instala las dependencias necesarias:
     ```bash
     npm install
     npm install html2canvas --save
     npm install express --save
     npm install sweetalert2 --save
     npm install jspdf   
     npm install json2csv
     ```

2. **Cambios necesarios en el código del frontend para el despliegue en red local**:

   #### Conexión al backend

   Abre el archivo correspondiente a la API (por ejemplo, `admin.component.ts`) y localiza las URL del backend.

   El componente `AdminComponent` asi como otros contienen múltiples llamadas al backend utilizando `http.get`, `http.put`, y `http.post`. Todas estas llamadas están configuradas para comunicarse con el backend en `localhost`. Para que funcione en una red local, estas rutas deben apuntar a la dirección IP del servidor donde se encuentra desplegado el backend.

##### Ejemplo: Llamadas HTTP

1. **ANTES:**
   ```typescript
   this.http.get('http://localhost:3000/cursos-propuestos')
   ```
   **DESPUÉS:**
   ```typescript
   this.http.get('http://192.168.x.x:3000/cursos-propuestos')
   ```
   Cambia `192.168.x.x` por la IP del servidor donde está ejecutándose el backend.

2. **ANTES:**
   ```typescript
   this.http.put(`http://localhost:3000/actualizar-curso/${id}`, { estado: 'rechazado' })
   ```
   **DESPUÉS:**
   ```typescript
   this.http.put(`http://192.168.x.x:3000/actualizar-curso/${id}`, { estado: 'rechazado' })
   ```

3. **ANTES:**
   ```typescript
   this.http.post('http://localhost:3000/register', instructorData)
   ```
   **DESPUÉS:**
   ```typescript
   this.http.post('http://192.168.x.x:3000/register', instructorData)
   ```

---

#### Pasos específicos para modificar el archivo

1. Abre el archivo `admin.component.ts`.
2. Busca todas las llamadas que incluyen `'http://localhost:3000'`.
3. Sustituye `'http://localhost:3000'` por `'http://192.168.x.x:3000'`, donde `192.168.x.x` es la dirección IP del servidor backend en la red local.

---

#### Inicia el frontend en red local

Después de modificar las rutas en el frontend, ejecuta el servidor Angular con este comando:

```bash
ng serve --host 0.0.0.0
```

Esto permitirá que el frontend sea accesible desde otros dispositivos en la misma red local.

---

#### Prueba de conexión

1. Abre un navegador en otro dispositivo conectado a la misma red.
2. Ingresa la dirección del frontend, sustituyendo `192.168.x.x` por la IP del servidor donde está ejecutándose el frontend:
   ```
   http://192.168.x.x:4200
   ```

---

De esta forma, las llamadas del componente `AdminComponent` y otras funcionalidades del frontend estarán correctamente configuradas para funcionar en red local.


## Notas adicionales

- Asegúrate de que los puertos utilizados (3000 para el backend y 4200 para el frontend) estén abiertos en el firewall de los equipos.
- Si necesitas acceder desde otro dispositivo en la red, verifica que ambos estén conectados a la misma red y que el servidor sea accesible.
- En caso de cambios en la configuración, reinicia los servidores para aplicar los ajustes.