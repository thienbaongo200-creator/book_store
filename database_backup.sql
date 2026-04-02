-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: bookstore_db
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `price` int DEFAULT NULL,
  `image_url` varchar(555) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `ix_books_title` (`title`),
  KEY `ix_books_id` (`id`),
  CONSTRAINT `books_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (1,'Clean Code','Robert C. Martin',450000,'/static/images/cleancode.jpg',15,1),(2,'Code Dạo Ký Sự','Phạm Huy Hoàng',120000,'/static/images/codedao.jpg',50,1),(3,'Python Crash Course','Eric Matthes',550000,'/static/images/python.jpg',10,1),(4,'Dạy Con Làm Giàu','Robert Kiyosaki',125000,'/static/images/dayconlamgiau.jpg',100,2),(5,'Kinh Tế Học Hài Hước','Steven Levitt',165000,'/static/images/kinhtehoc.jpg',30,2),(6,'Nhà Đầu Tư Thông Minh','Benjamin Graham',220000,'/static/images/dautu.jpg',25,2),(7,'Đắc Nhân Tâm','Dale Carnegie',85000,'/static/images/datnhantam.jpg',200,3),(8,'7 Thói Quen Thành Đạt','Stephen Covey',190000,'/static/images/7thoiquen.jpg',45,3),(9,'Atomic Habits','James Clear',250000,'/static/images/atomichabits.jpg',60,3),(10,'Nhà Giả Kim','Paulo Coelho',79000,'/static/images/nhagiakim.jpg',120,4),(11,'Mắt Biếc','Nguyễn Nhật Ánh',110000,'/static/images/matbiec.jpg',80,4),(12,'Số Đỏ','Vũ Trọng Phụng',65000,'/static/images/sodo.jpg',40,4),(13,'IELTS Trainer 2','Cambridge',320000,'/static/images/ielts.jpg',20,5),(14,'English Grammar in Use','Raymond Murphy',180000,'/static/images/grammar.jpg',55,5),(15,'Lược Sử Thời Gian','Stephen Hawking',145000,'/static/images/luocsuthoigian.jpg',15,6),(16,'Vũ Trụ','Carl Sagan',280000,'/static/images/vutru.jpg',12,6),(17,'Tâm Lý Học Tội Phạm','Nhiều tác giả',135000,'/static/images/tamlytoi-pham.jpg',25,7),(18,'Phi Lý Trí','Dan Ariely',155000,'/static/images/philytri.jpg',18,7),(19,'Vô Cùng Tàn Nhẫn Vô Cùng Yêu Thương','Sara Imas',115000,'/static/images/yeuthuong.jpg',35,8),(20,'Nuôi Con Không Phải Là Cuộc Chiến','Bubu Hương',140000,'/static/images/nuoicon.jpg',40,8),(21,'Doraemon Tuyển tập','Fujiko F. Fujio',35000,'/static/images/doraemon.jpg',150,9),(22,'Thám Tử Conan - Tập 100','Gosho Aoyama',25000,'/static/images/conan.jpg',300,9),(23,'One Piece','Eiichiro Oda',25000,'/static/images/onepiece.jpg',500,9),(24,'Dragon Ball','Akira Toriyama',22000,'/static/images/dragonball.jpg',100,9),(25,'Naruto - Tập 1','Masashi Kishimoto',22000,'/static/images/naruto.jpg',80,9),(26,'Thanh Gươm Diệt Quỷ','Koyoharu Gotouge',30000,'/static/images/demonslayer.jpg',120,9),(27,'Chú Thuật Hồi Chiến','Gege Akutami',30000,'/static/images/jjk.jpg',90,9),(28,'Spy x Family','Tatsuya Endo',40000,'/static/images/spyfamily.jpg',200,9),(29,'Dấu Ấn Rồng Thiêng','Riku Sanjo',25000,'/static/images/dauanrongthieng.jpg',50,9),(30,'Tí Quậy','Đào Hải',35000,'/static/images/tiquay.jpg',60,9);
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `book_id` (`book_id`),
  KEY `ix_cart_items_id` (`id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (2,4,1);
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_categories_name` (`name`),
  KEY `ix_categories_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (6,'Khoa học & Đời sống'),(2,'Kinh tế & Quản trị'),(3,'Kỹ năng sống'),(1,'Lập trình & Công nghệ'),(5,'Ngoại ngữ (IELTS/TOEIC)'),(8,'Nuôi dạy con'),(7,'Tâm lý học'),(9,'Truyện tranh & Manga'),(4,'Văn học & Tiểu thuyết');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `ix_users_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'bao_admin','admin123','admin'),(2,'user_demo','user123','user');
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

-- Dump completed on 2026-04-02  3:49:20
