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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (5,1,1,1,8,'Jugo de tomate','Jugo de tomate fresco',7,0.50,500.00,'2025-05-04 22:54:34','2026-05-05 05:00:00','2025-05-03 05:00:00','Verdadero','l62rrarijjb6uylavkmx','https://res.cloudinary.com/drwpai0vu/image/upload/v1746398775/l62rrarijjb6uylavkmx.png'),(6,1,2,2,7,'Jugo de Coco','Jugo de Coco con endulzantes artificiales',10,1.00,1.00,'2025-05-04 23:35:39','2026-01-01 05:00:00','2024-01-01 05:00:00','Verdadero','bez5gqidp5cc9sq6ryke','https://res.cloudinary.com/drwpai0vu/image/upload/v1746401239/bez5gqidp5cc9sq6ryke.png'),(7,1,3,1,6,'Queso','Queso artesanal',10,0.70,1.00,'2025-05-04 23:44:41','2026-05-05 05:00:00','2025-04-04 05:00:00','Verdadero','dbyeglycwpc9fyteh5ju','https://res.cloudinary.com/drwpai0vu/image/upload/v1746401781/dbyeglycwpc9fyteh5ju.png'),(8,5,2,2,5,'Chocolate','Chocolate en base a cacao fresco y endulzantes artificiales',100,0.50,100.00,'2025-05-05 00:08:30','2025-10-10 05:00:00','2024-10-10 05:00:00','Verdadero','iqydbkccpenl8sao1ipl','https://res.cloudinary.com/drwpai0vu/image/upload/v1746403210/iqydbkccpenl8sao1ipl.png'),(9,5,4,2,5,'Pan','Pan casero ',20,10.00,100.00,'2025-05-05 00:11:22','2026-04-04 05:00:00','2024-10-10 05:00:00','Verdadero','qnr1oic89andwgyoizna','https://res.cloudinary.com/drwpai0vu/image/upload/v1746403382/qnr1oic89andwgyoizna.png');
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

-- Dump completed on 2025-05-09 17:01:49
