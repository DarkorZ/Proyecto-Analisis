-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: emprendimientos
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `persona`
--

DROP TABLE IF EXISTS `persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persona` (
  `PERSONA_ID` int NOT NULL AUTO_INCREMENT,
  `DIRECCION_ID` int DEFAULT NULL,
  `ROL_ID` int DEFAULT NULL,
  `PERSONA_NOMBRE` char(100) NOT NULL,
  `PERSONA_TELEFONO` char(15) NOT NULL,
  `PERSONA_EMAIL` char(100) NOT NULL,
  `PERSONA_CONTRASENA` char(60) NOT NULL,
  `PERSONA_ESTADO` char(40) NOT NULL,
  `PERSONA_LOGIN` timestamp NULL DEFAULT NULL,
  `PERSONA_IMAGEN` longtext,
  `PERSONA_URL` text,
  PRIMARY KEY (`PERSONA_ID`),
  UNIQUE KEY `users_email_unique` (`PERSONA_EMAIL`),
  KEY `FK_RELATIONSHIP_11` (`DIRECCION_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona`
--

LOCK TABLES `persona` WRITE;
/*!40000 ALTER TABLE `persona` DISABLE KEYS */;
INSERT INTO `persona` VALUES (1,1,1,'Admin','123','Admin@gmail.com','$2b$10$BIIgOrWH3ki2GuJcM9hV0exEBxq97NJ6SKC5I3lGfgFCCI3BddljK','ACTIVO','2025-07-31 01:57:14','em03mrrjhl2dkgdj6pek','https://res.cloudinary.com/drwpai0vu/image/upload/v1746827473/em03mrrjhl2dkgdj6pek.png'),(5,791,2,'Vendedor01','123456789','Emprendedor@gmail.com','$2b$10$eimJ1g0pSk7MqO04cC9jTOaoLLkkN31UJ6BBSyIQltuvKMgzUS9T2','ACTIVO','2025-07-31 02:34:56','b75pbdxfcwkxhvt5bes3','https://res.cloudinary.com/drwpai0vu/image/upload/v1753926570/b75pbdxfcwkxhvt5bes3.jpg'),(6,76,2,'Emprendedor2','0987654321','Emprendedor2@gmail.com','$2b$10$S43APTHw9UT319tTPNHFmenjEG7CXieihAWWkSvFrXpgcT2qltDjS','ACTIVO','2025-07-31 02:06:27','mrqxwzaqjy1vwgmjum4l','https://res.cloudinary.com/drwpai0vu/image/upload/v1753926703/mrqxwzaqjy1vwgmjum4l.jpg'),(7,167,2,'Pepito','0966666666','Pepito@gmail.com','$2b$10$MTl9E7MxFJHUPptr7N8wcejGs7VQzTqp9fuiiI6X09VGVgWtXHuia','ACTIVO','2025-07-31 02:26:21','ge9pd4fbmkqyraofxmbi','https://res.cloudinary.com/drwpai0vu/image/upload/v1753928604/ge9pd4fbmkqyraofxmbi.jpg');
/*!40000 ALTER TABLE `persona` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-30 22:13:14
