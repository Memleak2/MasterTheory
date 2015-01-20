CREATE DATABASE  IF NOT EXISTS "sbariapp" /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `sbariapp`;
-- MySQL dump 10.13  Distrib 5.6.17, for Win32 (x86)
--
-- Host: 127.0.0.1    Database: sbariapp
-- ------------------------------------------------------
-- Server version	5.6.15-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `plaza`
--

DROP TABLE IF EXISTS `plaza`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plaza` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Type` varchar(100) NOT NULL,
  `Value` varchar(100) NOT NULL,
  `When` datetime NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM AUTO_INCREMENT=72 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plaza`
--

LOCK TABLES `plaza` WRITE;
/*!40000 ALTER TABLE `plaza` DISABLE KEYS */;
INSERT INTO `plaza` VALUES (35,'Cat','Birra','2014-11-09 00:00:00'),(36,'Cat','Musica','2014-11-09 00:00:00'),(37,'Cat','Pizzaasdasda','2014-11-09 00:00:00'),(38,'Cat','Pizza','2014-11-10 00:00:00'),(39,'Cat','Pizzaasdasd','2014-11-11 00:00:00'),(40,'Cat','Eventi','2014-11-12 00:00:00'),(41,'Cat','Birra','2014-11-09 00:00:00'),(42,'Cat','Birra','2014-11-08 00:00:00'),(43,'Cat','Musica','2014-11-09 00:00:00'),(44,'Cat','Pizzaasdasda','2014-11-09 00:00:00'),(45,'Cat','Pizzaasdasda','2014-11-09 00:00:00'),(46,'Cat','Pizza','2014-11-09 00:00:00'),(47,'Cat','Pizzaasdasda','2014-11-09 00:00:00'),(48,'Cat','Musica','2014-11-09 00:00:00'),(49,'Cat','Birra','2014-11-07 00:00:00'),(50,'Cat','Pizzaasdasda','2014-11-10 00:00:00'),(51,'Cat','Birra','2014-11-10 00:00:00'),(52,'Cat','Birra','2014-11-10 00:00:00'),(53,'Cat','Musica','2014-11-10 00:00:00'),(54,'Cat','Birra','2014-11-10 00:00:00'),(55,'Cat','Musica','2014-11-10 00:00:00'),(56,'Cat','Birra','2014-11-10 00:00:00'),(57,'Cat','Musica','2014-11-10 00:00:00'),(58,'Cat','Birra','2014-11-10 00:00:00'),(59,'Cat','Pizzaasdasda','2014-11-10 00:00:00'),(60,'Cat','Pizzaasdasd','2014-11-10 00:00:00'),(61,'Cat','Eventi','2014-11-10 00:00:00'),(62,'Cat','Pizzaasdasd','2014-11-10 00:00:00'),(63,'Cat','Pizza','2014-11-10 00:00:00'),(64,'Cat','Pizzaasdasda','2014-11-10 00:00:00'),(65,'Cat','Musica','2014-11-10 00:00:00'),(66,'Cat','Musica','2014-11-10 00:00:00'),(67,'Cat','Birra','2014-11-10 00:00:00'),(68,'Cat','Musica','2014-11-10 00:00:00'),(69,'Cat','Pizzaasdasda','2014-11-10 00:00:00'),(70,'Cat','Eventi','2014-11-10 00:00:00'),(71,'Cat','Eventi','2014-11-10 00:00:00');
/*!40000 ALTER TABLE `plaza` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(45) NOT NULL,
  `Password` varchar(45) NOT NULL,
  `Email` varchar(45) NOT NULL,
  `Telephone` varchar(15) DEFAULT NULL,
  `RegisteredSince` datetime NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Username_UNIQUE` (`Username`),
  UNIQUE KEY `Email_UNIQUE` (`Email`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'memleak','a','gt.tortorella@gmail.com','3286562037','2017-11-11 00:00:00');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-11-10  2:15:47
