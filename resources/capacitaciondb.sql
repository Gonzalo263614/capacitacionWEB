CREATE DATABASE  IF NOT EXISTS `capacitaciondb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `capacitaciondb`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: capacitaciondb
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `archivos`
--

DROP TABLE IF EXISTS `archivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `archivos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `curso_id` int DEFAULT NULL,
  `instructor_id` int DEFAULT NULL,
  `nombre_archivo` varchar(255) DEFAULT NULL,
  `archivo` longblob,
  `fecha_subida` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `curso_id` (`curso_id`),
  KEY `instructor_id` (`instructor_id`),
  CONSTRAINT `archivos_ibfk_1` FOREIGN KEY (`curso_id`) REFERENCES `cursos_propuestos` (`id`),
  CONSTRAINT `archivos_ibfk_2` FOREIGN KEY (`instructor_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `archivos`
--

LOCK TABLES `archivos` WRITE;
/*!40000 ALTER TABLE `archivos` DISABLE KEYS */;
/*!40000 ALTER TABLE `archivos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `archivos_contenidos_tematicos`
--

DROP TABLE IF EXISTS `archivos_contenidos_tematicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `archivos_contenidos_tematicos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `curso_id` int DEFAULT NULL,
  `instructor_id` int DEFAULT NULL,
  `nombre_archivo` varchar(255) DEFAULT NULL,
  `archivo` longblob,
  `fecha_subida` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `curso_id` (`curso_id`),
  KEY `instructor_id` (`instructor_id`),
  CONSTRAINT `archivos_contenidos_tematicos_ibfk_1` FOREIGN KEY (`curso_id`) REFERENCES `cursos_propuestos` (`id`),
  CONSTRAINT `archivos_contenidos_tematicos_ibfk_2` FOREIGN KEY (`instructor_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `archivos_contenidos_tematicos`
--

LOCK TABLES `archivos_contenidos_tematicos` WRITE;
/*!40000 ALTER TABLE `archivos_contenidos_tematicos` DISABLE KEYS */;
/*!40000 ALTER TABLE `archivos_contenidos_tematicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `archivos_curso_criterios`
--

DROP TABLE IF EXISTS `archivos_curso_criterios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `archivos_curso_criterios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jefe_id` int DEFAULT NULL,
  `nombre_instructor` varchar(255) DEFAULT NULL,
  `apellido_paterno_instructor` varchar(255) DEFAULT NULL,
  `apellido_materno_instructor` varchar(255) DEFAULT NULL,
  `curp_instructor` varchar(18) DEFAULT NULL,
  `nombre_curso` varchar(255) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `nombre_archivo` varchar(255) DEFAULT NULL,
  `archivo` longblob,
  `fecha_subida` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `jefe_id` (`jefe_id`),
  CONSTRAINT `archivos_curso_criterios_ibfk_1` FOREIGN KEY (`jefe_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `archivos_curso_criterios`
--

LOCK TABLES `archivos_curso_criterios` WRITE;
/*!40000 ALTER TABLE `archivos_curso_criterios` DISABLE KEYS */;
/*!40000 ALTER TABLE `archivos_curso_criterios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asistencias`
--

DROP TABLE IF EXISTS `asistencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asistencias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `curso_id` int DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `asistencia` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `curso_id` (`curso_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `asistencias_ibfk_1` FOREIGN KEY (`curso_id`) REFERENCES `cursos_propuestos` (`id`),
  CONSTRAINT `asistencias_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistencias`
--

LOCK TABLES `asistencias` WRITE;
/*!40000 ALTER TABLE `asistencias` DISABLE KEYS */;
/*!40000 ALTER TABLE `asistencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calificaciones`
--

DROP TABLE IF EXISTS `calificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calificaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `curso_id` int DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `calificacion` decimal(5,2) DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `curso_id` (`curso_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `calificaciones_ibfk_1` FOREIGN KEY (`curso_id`) REFERENCES `cursos_propuestos` (`id`),
  CONSTRAINT `calificaciones_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calificaciones`
--

LOCK TABLES `calificaciones` WRITE;
/*!40000 ALTER TABLE `calificaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `calificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `codigocurso`
--

DROP TABLE IF EXISTS `codigocurso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `codigocurso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `curso_id` int DEFAULT NULL,
  `instructor_id` int DEFAULT NULL,
  `codigo` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `curso_id` (`curso_id`),
  KEY `instructor_id` (`instructor_id`),
  CONSTRAINT `codigocurso_ibfk_1` FOREIGN KEY (`curso_id`) REFERENCES `cursos_propuestos` (`id`),
  CONSTRAINT `codigocurso_ibfk_2` FOREIGN KEY (`instructor_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `codigocurso`
--

LOCK TABLES `codigocurso` WRITE;
/*!40000 ALTER TABLE `codigocurso` DISABLE KEYS */;
/*!40000 ALTER TABLE `codigocurso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `codigomaestrocurso`
--

DROP TABLE IF EXISTS `codigomaestrocurso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `codigomaestrocurso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `curso_id` int DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `codigo` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `curso_id` (`curso_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `codigomaestrocurso_ibfk_1` FOREIGN KEY (`curso_id`) REFERENCES `cursos_propuestos` (`id`),
  CONSTRAINT `codigomaestrocurso_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `codigomaestrocurso`
--

LOCK TABLES `codigomaestrocurso` WRITE;
/*!40000 ALTER TABLE `codigomaestrocurso` DISABLE KEYS */;
/*!40000 ALTER TABLE `codigomaestrocurso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cursos_propuestos`
--

DROP TABLE IF EXISTS `cursos_propuestos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cursos_propuestos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_curso` varchar(255) DEFAULT NULL,
  `estado` enum('pendiente','aceptado','rechazado','pendiente_revision','terminado') DEFAULT 'pendiente',
  `asignaturas_requeridas` text,
  `contenidos_requeridos` text,
  `numero_docentes` int DEFAULT NULL,
  `tipo_asignatura` enum('carrera generica','modulo especialidad') DEFAULT 'carrera generica',
  `actividad_evento` varchar(255) DEFAULT NULL,
  `objetivo` text,
  `carreras_atendidas` text,
  `periodo` varchar(255) DEFAULT NULL,
  `turno` enum('M','V') DEFAULT 'M',
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `justificacion` text,
  `numero_horas` int DEFAULT NULL,
  `horario` varchar(255) DEFAULT NULL,
  `lugar` varchar(255) DEFAULT NULL,
  `requisitos` text,
  `tipo_curso` enum('Formación Docente','Actualización Profesional') DEFAULT 'Formación Docente',
  `nombre_instructor` varchar(100) DEFAULT NULL,
  `apellidopaterno_instructor` varchar(100) DEFAULT NULL,
  `apellidomaterno_instructor` varchar(255) DEFAULT NULL,
  `curp_instructor` varchar(255) DEFAULT NULL,
  `rfc_instructor` varchar(255) DEFAULT NULL,
  `maxestudios_instructor` enum('Licenciatura','Maestría','Doctorado','Técnico Superior') DEFAULT 'Licenciatura',
  `email_instructor` varchar(255) DEFAULT NULL,
  `password_instructor` varchar(255) DEFAULT NULL,
  `sexo_instructor` enum('M','F') DEFAULT 'M',
  `tipo_contrato_instructor` enum('tiempo completo','30 hrs','20 hrs','asignatura','honorarios','no aplica') DEFAULT 'no aplica',
  `cupo_actual` int DEFAULT '0',
  `comentario_revision` text,
  `enfoque_curso` enum('Reforzamiento','Nivelacion','Actualizacion') DEFAULT 'Actualizacion',
  `modalidad_curso` enum('presencial','semipresencial','virtual') DEFAULT 'presencial',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cursos_propuestos`
--

LOCK TABLES `cursos_propuestos` WRITE;
/*!40000 ALTER TABLE `cursos_propuestos` DISABLE KEYS */;
/*!40000 ALTER TABLE `cursos_propuestos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departamento_curso`
--

DROP TABLE IF EXISTS `departamento_curso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departamento_curso` (
  `departamento_id` int NOT NULL,
  `curso_id` int NOT NULL,
  PRIMARY KEY (`departamento_id`,`curso_id`),
  KEY `curso_id` (`curso_id`),
  CONSTRAINT `departamento_curso_ibfk_1` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos` (`id`),
  CONSTRAINT `departamento_curso_ibfk_2` FOREIGN KEY (`curso_id`) REFERENCES `cursos_propuestos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departamento_curso`
--

LOCK TABLES `departamento_curso` WRITE;
/*!40000 ALTER TABLE `departamento_curso` DISABLE KEYS */;
/*!40000 ALTER TABLE `departamento_curso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departamentos`
--

DROP TABLE IF EXISTS `departamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departamentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` enum('Ciencias Básicas','Ciencias Económico - Administrativas','Desarrollo Académico','Eléctrica - Electrónica','Ingeniería Industrial','Metal - Mecánica','Sistemas y Computación','Química y Bioquímica') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departamentos`
--

LOCK TABLES `departamentos` WRITE;
/*!40000 ALTER TABLE `departamentos` DISABLE KEYS */;
/*!40000 ALTER TABLE `departamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `encuesta_jefe`
--

DROP TABLE IF EXISTS `encuesta_jefe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `encuesta_jefe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jefe_curso_id` int DEFAULT NULL,
  `inscripcion_id` int DEFAULT NULL,
  `respuestas_seccion1` json DEFAULT NULL,
  `sugerencias` text,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `jefe_curso_id` (`jefe_curso_id`),
  KEY `inscripcion_id` (`inscripcion_id`),
  CONSTRAINT `encuesta_jefe_ibfk_1` FOREIGN KEY (`jefe_curso_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `encuesta_jefe_ibfk_2` FOREIGN KEY (`inscripcion_id`) REFERENCES `inscripciones` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `encuesta_jefe`
--

LOCK TABLES `encuesta_jefe` WRITE;
/*!40000 ALTER TABLE `encuesta_jefe` DISABLE KEYS */;
/*!40000 ALTER TABLE `encuesta_jefe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `encuestas`
--

DROP TABLE IF EXISTS `encuestas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `encuestas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_inscripcion` int DEFAULT NULL,
  `respuestas_seccion1` json DEFAULT NULL,
  `respuestas_seccion2` json DEFAULT NULL,
  `respuestas_seccion3` json DEFAULT NULL,
  `respuestas_seccion4` json DEFAULT NULL,
  `sugerencias` text,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_inscripcion` (`id_inscripcion`),
  CONSTRAINT `encuestas_ibfk_1` FOREIGN KEY (`id_inscripcion`) REFERENCES `inscripciones` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `encuestas`
--

LOCK TABLES `encuestas` WRITE;
/*!40000 ALTER TABLE `encuestas` DISABLE KEYS */;
/*!40000 ALTER TABLE `encuestas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inscripciones`
--

DROP TABLE IF EXISTS `inscripciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inscripciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `curso_id` int DEFAULT NULL,
  `fecha_inscripcion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `curso_id` (`curso_id`),
  CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `inscripciones_ibfk_2` FOREIGN KEY (`curso_id`) REFERENCES `cursos_propuestos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inscripciones`
--

LOCK TABLES `inscripciones` WRITE;
/*!40000 ALTER TABLE `inscripciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `inscripciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instructor_curso`
--

DROP TABLE IF EXISTS `instructor_curso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instructor_curso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario_instructor` int DEFAULT NULL,
  `id_curso_propuesto` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario_instructor` (`id_usuario_instructor`),
  KEY `id_curso_propuesto` (`id_curso_propuesto`),
  CONSTRAINT `instructor_curso_ibfk_1` FOREIGN KEY (`id_usuario_instructor`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `instructor_curso_ibfk_2` FOREIGN KEY (`id_curso_propuesto`) REFERENCES `cursos_propuestos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructor_curso`
--

LOCK TABLES `instructor_curso` WRITE;
/*!40000 ALTER TABLE `instructor_curso` DISABLE KEYS */;
/*!40000 ALTER TABLE `instructor_curso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instructor_requisitos`
--

DROP TABLE IF EXISTS `instructor_requisitos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instructor_requisitos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `curso_id` int DEFAULT NULL,
  `calificaciones` tinyint DEFAULT NULL,
  `contenidos` tinyint DEFAULT NULL,
  `evidencias` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `curso_id` (`curso_id`),
  CONSTRAINT `instructor_requisitos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `instructor_requisitos_ibfk_2` FOREIGN KEY (`curso_id`) REFERENCES `cursos_propuestos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructor_requisitos`
--

LOCK TABLES `instructor_requisitos` WRITE;
/*!40000 ALTER TABLE `instructor_requisitos` DISABLE KEYS */;
/*!40000 ALTER TABLE `instructor_requisitos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jefe_curso`
--

DROP TABLE IF EXISTS `jefe_curso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jefe_curso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_curso` int DEFAULT NULL,
  `id_jefe` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_curso` (`id_curso`),
  KEY `id_jefe` (`id_jefe`),
  CONSTRAINT `jefe_curso_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `cursos_propuestos` (`id`),
  CONSTRAINT `jefe_curso_ibfk_2` FOREIGN KEY (`id_jefe`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jefe_curso`
--

LOCK TABLES `jefe_curso` WRITE;
/*!40000 ALTER TABLE `jefe_curso` DISABLE KEYS */;
/*!40000 ALTER TABLE `jefe_curso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `requisitos_curso`
--

DROP TABLE IF EXISTS `requisitos_curso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `requisitos_curso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_curso` int DEFAULT NULL,
  `orden_admin` tinyint DEFAULT NULL,
  `orden_subdirector` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_curso` (`id_curso`),
  CONSTRAINT `requisitos_curso_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `cursos_propuestos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requisitos_curso`
--

LOCK TABLES `requisitos_curso` WRITE;
/*!40000 ALTER TABLE `requisitos_curso` DISABLE KEYS */;
/*!40000 ALTER TABLE `requisitos_curso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_requisitos`
--

DROP TABLE IF EXISTS `usuario_requisitos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_requisitos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `curso_id` int DEFAULT NULL,
  `asistencias` tinyint DEFAULT NULL,
  `calificacion` tinyint DEFAULT NULL,
  `evidencias` tinyint DEFAULT NULL,
  `encuesta1` tinyint DEFAULT NULL,
  `encuestajefes` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `curso_id` (`curso_id`),
  CONSTRAINT `usuario_requisitos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `usuario_requisitos_ibfk_2` FOREIGN KEY (`curso_id`) REFERENCES `cursos_propuestos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_requisitos`
--

LOCK TABLES `usuario_requisitos` WRITE;
/*!40000 ALTER TABLE `usuario_requisitos` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario_requisitos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `apellidopaterno` varchar(100) DEFAULT NULL,
  `apellidomaterno` varchar(255) DEFAULT NULL,
  `rol` enum('administrador','jefe','maestro','instructor','subdirector') DEFAULT 'maestro',
  `curp` varchar(255) DEFAULT NULL,
  `rfc` varchar(255) DEFAULT NULL,
  `maxestudios` enum('Licenciatura','Maestría','Doctorado','Técnico Superior') DEFAULT 'Licenciatura',
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `sexo` enum('M','F') DEFAULT 'M',
  `departamento` enum('Ciencias Básicas','Ciencias Económico - Administrativas','Desarrollo Académico','Eléctrica - Electrónica','Ingeniería Industrial','Metal - Mecánica','Sistemas y Computación','Química y Bioquímica','No aplica') DEFAULT 'No aplica',
  `tipo_contrato` enum('Tiempo completo','30 hrs','20 hrs','Asignatura','Honorarios','No aplica') DEFAULT 'No aplica',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (4,'Admin','Tec','ita','administrador','asdf1234','hjkl5678','Licenciatura','$2b$10$zn/TcYSA/SPP.13oKcyGA.Rh1Mc5SMXtzqyCXfxE4QqzDsFE2R0vq','admon@gmail.com','M','Metal - Mecánica','Asignatura');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-22 23:49:24
