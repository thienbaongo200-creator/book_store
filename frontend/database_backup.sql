-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: bookstore_db
-- ------------------------------------------------------
-- Server version	8.0.45

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
  `description` text,
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
INSERT INTO `books` VALUES (1,'Clean Code','Robert C. Martin',450000,'/static/images/cleancode.jpg',15,1,NULL),(2,'Code Dạo Ký Sự','Phạm Huy Hoàng',120000,'/static/images/codedao.jpg',50,1,NULL),(3,'Python Crash Course','Eric Matthes',550000,'/static/images/python.jpg',10,1,NULL),(4,'Dạy Con Làm Giàu','Robert Kiyosaki',125000,'/static/images/dayconlamgiau.jpg',100,2,NULL),(5,'Kinh Tế Học Hài Hước','Steven Levitt',165000,'/static/images/kinhtehoc.jpg',30,2,NULL),(6,'Nhà Đầu Tư Thông Minh','Benjamin Graham',220000,'/static/images/dautu.jpg',25,2,NULL),(7,'Đắc Nhân Tâm','Dale Carnegie',85000,'/static/images/datnhantam.jpg',200,3,NULL),(8,'7 Thói Quen Thành Đạt','Stephen Covey',190000,'/static/images/7thoiquen.jpg',45,3,NULL),(9,'Atomic Habits','James Clear',250000,'/static/images/atomichabits.jpg',60,3,NULL),(10,'Nhà Giả Kim','Paulo Coelho',79000,'/static/images/nhagiakim.jpg',120,4,NULL),(11,'Mắt Biếc','Nguyễn Nhật Ánh',110000,'/static/images/matbiec.jpg',80,4,NULL),(12,'Số Đỏ','Vũ Trọng Phụng',65000,'/static/images/sodo.jpg',40,4,NULL),(13,'IELTS Trainer 2','Cambridge',320000,'/static/images/ielts.jpg',20,5,NULL),(14,'English Grammar in Use','Raymond Murphy',180000,'/static/images/grammar.jpg',55,5,NULL),(15,'Lược Sử Thời Gian','Stephen Hawking',145000,'/static/images/luocsuthoigian.jpg',15,6,NULL),(16,'Vũ Trụ','Carl Sagan',280000,'/static/images/vutru.jpg',12,6,NULL),(17,'Tâm Lý Học Tội Phạm','Nhiều tác giả',135000,'/static/images/tamlytoi-pham.jpg',25,7,NULL),(18,'Phi Lý Trí','Dan Ariely',155000,'/static/images/philytri.jpg',18,7,NULL),(19,'Vô Cùng Tàn Nhẫn Vô Cùng Yêu Thương','Sara Imas',115000,'/static/images/yeuthuong.jpg',35,8,NULL),(20,'Nuôi Con Không Phải Là Cuộc Chiến','Bubu Hương',140000,'/static/images/nuoicon.jpg',40,8,NULL),(21,'Doraemon Tuyển tập','Fujiko F. Fujio',35000,'/static/images/doraemon.jpg',150,9,NULL),(22,'Thám Tử Conan - Tập 100','Gosho Aoyama',25000,'/static/images/conan.jpg',300,9,NULL),(23,'One Piece','Eiichiro Oda',25000,'/static/images/onepiece.jpg',500,9,NULL),(24,'Dragon Ball','Akira Toriyama',22000,'/static/images/dragonball.jpg',100,9,NULL),(25,'Naruto - Tập 1','Masashi Kishimoto',22000,'/static/images/naruto.jpg',80,9,NULL),(26,'Thanh Gươm Diệt Quỷ','Koyoharu Gotouge',30000,'/static/images/demonslayer.jpg',120,9,NULL),(27,'Chú Thuật Hồi Chiến','Gege Akutami',30000,'/static/images/jjk.jpg',90,9,NULL),(28,'Spy x Family','Tatsuya Endo',40000,'/static/images/spyfamily.jpg',200,9,NULL),(29,'Dấu Ấn Rồng Thiêng','Riku Sanjo',25000,'/static/images/dauanrongthieng.jpg',50,9,NULL),(30,'Tí Quậy','Đào Hải',35000,'/static/images/tiquay.jpg',60,9,NULL);
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
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `book_id` (`book_id`),
  KEY `ix_cart_items_id` (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (18,1,1,3),(19,2,1,3);
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
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `book_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price_at_purchase` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `book_id` (`book_id`),
  KEY `ix_order_items_id` (`id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,2,1,1,450000),(2,2,3,1,550000),(3,2,2,1,120000),(4,3,3,1,550000),(5,4,2,1,120000),(6,5,3,2,550000),(7,6,3,1,550000),(8,7,3,1,550000),(9,8,3,1,550000),(10,8,4,1,125000),(11,9,1,1,450000),(12,10,4,1,125000);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `total_price` int DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `ix_orders_id` (`id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,550000,'Success',2,'2026-04-05 08:33:34'),(2,1120000,'Success',2,'2026-04-05 08:33:34'),(3,550000,'Success',2,'2026-04-05 08:33:34'),(4,120000,'Success',2,'2026-04-05 08:33:34'),(5,1100000,'Success',1,'2026-04-05 08:33:34'),(6,550000,'Success',2,'2026-04-05 08:33:34'),(7,550000,'Success',2,'2026-04-05 08:34:08'),(8,675000,'Success',3,'2026-04-05 08:40:15'),(9,450000,'Success',2,'2026-04-06 04:48:35'),(10,125000,'Success',3,'2026-04-13 06:50:24');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `comment` text,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `_user_book_review_uc` (`user_id`,`book_id`),
  KEY `book_id` (`book_id`),
  KEY `ix_reviews_id` (`id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'bao_admin','admin123','admin'),(2,'user_demo','user123','user'),(3,'Ngo Bao','Bao123','user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `book_id` (`book_id`),
  KEY `user_id` (`user_id`),
  KEY `ix_wishlist_id` (`id`),
  CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
INSERT INTO `wishlist` VALUES (2,1,2);
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-13  7:29:40
