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
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `PRODUCTO_ID` int NOT NULL AUTO_INCREMENT,
  `PERSONA_ID` int DEFAULT NULL,
  `CATEGORIA_ID` int DEFAULT NULL,
  `PRESENTACION_ID` int DEFAULT NULL,
  `MEDIDA_ID` int DEFAULT NULL,
  `PRODUCTO_NOMBRE` char(60) NOT NULL,
  `PRODUCTO_DESCRIPCION` text NOT NULL,
  `PRODUCTO_CANTIDAD` int NOT NULL,
  `PRODUCTO_PRECIO` decimal(5,2) NOT NULL,
  `PRODUCTO_MEDIDA` decimal(5,2) DEFAULT NULL,
  `PRODUCTO_FECHAPUBLICACION` timestamp NOT NULL,
  `PRODUCTO_FECHALIMITE` timestamp NOT NULL,
  `PRODUCTO_FECHACOCECHA` timestamp NULL DEFAULT NULL,
  `PRODUCTO_ESTADO` char(30) NOT NULL,
  `PRODUCTO_IMAGEN` longtext,
  `PRODUCTO_URL` text,
  PRIMARY KEY (`PRODUCTO_ID`),
  KEY `FK_RELATIONSHIP_18` (`MEDIDA_ID`),
  KEY `FK_RELATIONSHIP_17` (`PRESENTACION_ID`),
  CONSTRAINT `FK_RELATIONSHIP_17` FOREIGN KEY (`PRESENTACION_ID`) REFERENCES `presentacion` (`PRESENTACION_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_RELATIONSHIP_18` FOREIGN KEY (`MEDIDA_ID`) REFERENCES `medida` (`MEDIDA_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (10,6,4,1,4,'Juego de Acople','JUEGO DE ACOPLE\r\n(COMPRESOR) 5PZAS (ELITE)',4,0.50,1.00,'2025-07-31 02:08:15','2025-08-30 05:00:00','2025-07-30 05:00:00','Verdadero','jvlmhytwfc0qvw36ieg1','https://res.cloudinary.com/drwpai0vu/image/upload/v1753927518/jvlmhytwfc0qvw36ieg1.png'),(11,6,3,3,5,'Destornilladores','JUEGO DE DESTORNILLADORES\r\nBP 2 PIEZAS ESTRELLA Y PLANO',4,2.00,1.00,'2025-07-31 02:09:58','2025-08-30 05:00:00','2025-07-30 05:00:00','Verdadero','qgkflb7ohigovqkhjcsp','https://res.cloudinary.com/drwpai0vu/image/upload/v1753927621/qgkflb7ohigovqkhjcsp.png'),(12,6,3,3,5,'Fumigadora','FUMIGADORA CON BATERIA\r\nTIPO MOCHILA 20LTS BP',1,10.00,5.00,'2025-07-31 02:11:19','2025-08-30 05:00:00','2025-07-30 05:00:00','Verdadero','laug6cwoiemeox0vkxoh','https://res.cloudinary.com/drwpai0vu/image/upload/v1753927702/laug6cwoiemeox0vkxoh.png'),(13,6,1,3,5,'CODO 90 grados SOLDABLE','CODO 90° SOLDABLE SCH40\r\n¨Orostyle¨',10,0.20,1.00,'2025-07-31 02:14:36','2025-08-30 05:00:00','2025-07-30 05:00:00','Verdadero','tjwvd4barzdlj56zlryl','https://res.cloudinary.com/drwpai0vu/image/upload/v1753927899/tjwvd4barzdlj56zlryl.png'),(14,6,1,3,5,'Universal Soldable','UNIVERSAL SOLDABLE SCH40\r\n¨Orostyle¨\r\n',10,1.00,1.00,'2025-07-31 02:15:22','2025-08-30 05:00:00','2025-07-30 05:00:00','Verdadero','ds9hbg9u4brjqgd9td0l','https://res.cloudinary.com/drwpai0vu/image/upload/v1753927945/ds9hbg9u4brjqgd9td0l.png'),(15,5,1,3,5,'Tapon Desague Hembra','TAPON DESAGUE HEMBA OROSTYLE',10,0.60,1.00,'2025-07-31 02:16:27','2025-08-30 05:00:00','2025-07-30 05:00:00','Verdadero','zcy3aj2p1jeuq0ci3vkp','https://res.cloudinary.com/drwpai0vu/image/upload/v1753928009/zcy3aj2p1jeuq0ci3vkp.png'),(16,5,4,1,5,'Corta Frio #4.5','PINZA REDONDA ELITE 4.5',10,1.00,1.00,'2025-07-31 02:19:41','2025-08-30 05:00:00','2025-07-30 05:00:00','Verdadero','ei2dyookvibkjyt8nu0o','https://res.cloudinary.com/drwpai0vu/image/upload/v1753928204/ei2dyookvibkjyt8nu0o.png'),(17,5,4,1,5,'Playo de 12','Playo Elite Articulado De 12pulg',0,2.00,2.00,'2025-07-31 02:20:56','2026-08-30 05:00:00','2025-07-30 05:00:00','Verdadero','wy0qlvorvjpxxnblahma','https://res.cloudinary.com/drwpai0vu/image/upload/v1753928279/wy0qlvorvjpxxnblahma.png'),(18,5,4,3,4,'Dados Mecanicos','Dados Para Mecánico De 1/2” 8mm',4,5.00,1.00,'2025-07-31 02:22:06','2025-08-30 05:00:00','2025-07-30 05:00:00','Verdadero','wox3v3rilnpjsrpsr8su','https://res.cloudinary.com/drwpai0vu/image/upload/v1753928349/wox3v3rilnpjsrpsr8su.png');
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
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
