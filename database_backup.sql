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
INSERT INTO `books` VALUES (1,'Clean Code','Robert C. Martin',450000,'/static/images/cleancode.jpg',15,1,'Cuốn sách này được coi là \"kinh thánh\" đối với bất kỳ lập trình viên nào muốn nâng tầm kỹ năng của mình. Tác giả Robert C. Martin không chỉ dạy cách viết mã để máy tính có thể hiểu, mà quan trọng hơn là cách viết để con người có thể hiểu. Qua những nguyên tắc và ví dụ thực tiễn, bạn sẽ học được cách đặt tên biến, cấu trúc hàm và tổ chức các lớp (class) sao cho mã nguồn luôn sạch sẽ, dễ bảo trì và giảm thiểu tối đa sai sót trong quá trình phát triển phần mềm.'),(2,'Code Dạo Ký Sự','Phạm Huy Hoàng',120000,'/static/images/codedao.jpg',50,1,'Khác với những cuốn sách kỹ thuật khô khan, đây là những dòng chia sẻ đầy tâm huyết và gần gũi của một lập trình viên dày dạn kinh nghiệm về nghề nghiệp. Tác phẩm tập trung vào các kỹ năng mềm, phương pháp tự học và những trải nghiệm thực tế trong môi trường làm việc ngành IT. Đây là hành trang tinh thần quý báu giúp các bạn sinh viên và lập trình viên trẻ định hướng lộ trình nghề nghiệp, từ việc chọn ngôn ngữ lập trình đến cách đối mặt với áp lực trong các dự án thực tế.'),(3,'Python Crash Course','Eric Matthes',550000,'/static/images/python.jpg',10,1,'Đây là cuốn cẩm nang hoàn hảo cho những ai muốn bắt đầu chinh phục ngôn ngữ lập trình Python một cách nhanh chóng và hiệu quả. Cuốn sách được chia làm hai phần rõ rệt: phần đầu cung cấp kiến thức nền tảng về cú pháp, dữ liệu và lập trình hướng đối tượng; phần sau là các dự án thực hành sinh động như phát triển game, phân tích dữ liệu và xây dựng ứng dụng web. Cách tiếp cận \"học đi đôi với hành\" này giúp người đọc biến lý thuyết thành những sản phẩm thực tế chỉ trong thời gian ngắn.'),(4,'Dạy Con Làm Giàu','Robert Kiyosaki',125000,'/static/images/dayconlamgiau.jpg',100,2,'Tác phẩm kinh điển này đã thay đổi tư duy tài chính của hàng triệu người trên thế giới bằng cách phân biệt rõ ràng giữa \"tài sản\" và \"tiêu sản\". Thông qua câu chuyện về hai người cha với hai quan điểm đối lập về tiền bạc, Robert Kiyosaki nhấn mạnh tầm quan trọng của việc giáo dục tài chính và cách để tiền bạc làm việc cho mình thay vì phải làm việc vì tiền. Cuốn sách là bài học về sự nhạy bén trong kinh doanh và khát vọng đạt được tự do tài chính bền vững.'),(5,'Kinh Tế Học Hài Hước','Steven Levitt',165000,'/static/images/kinhtehoc.jpg',30,2,'Cuốn sách mở ra một góc nhìn mới lạ và đầy bất ngờ về thế giới bằng cách sử dụng các công cụ kinh tế học để giải thích những hiện tượng đời sống tưởng chừng không liên quan. Bằng cách đặt ra những câu hỏi hóc búa và phân tích dữ liệu một cách thông minh, các tác giả chứng minh rằng đằng sau mỗi hành động của con người đều có những động cơ kinh tế ẩn giấu. Đây là tác phẩm giúp bạn rèn luyện tư duy phản biện và nhìn nhận các vấn đề xã hội dưới một lăng kính sắc sảo hơn.'),(6,'Nhà Đầu Tư Thông Minh','Benjamin Graham',220000,'/static/images/dautu.jpg',25,2,'Được Warren Buffett đánh giá là cuốn sách hay nhất về đầu tư từng được viết ra, tác phẩm này cung cấp những triết lý cốt lõi về \"đầu tư giá trị\". Benjamin Graham dạy người đọc cách bảo vệ mình trước những biến động của thị trường, cách phân tích giá trị nội tại của doanh nghiệp và tầm quan trọng của sự kiên nhẫn. Cuốn sách không chỉ là giáo trình về chứng khoán mà còn là bài học về tâm lý vững vàng và kỷ luật sắt đá trong thế giới tài chính đầy rủi ro.'),(7,'Đắc Nhân Tâm','Dale Carnegie',85000,'/static/images/datnhantam.jpg',200,3,'Đây là cuốn sách đầu bảng về nghệ thuật giao tiếp và thu phục lòng người, giúp xây dựng những mối quan hệ tốt đẹp dựa trên sự thấu hiểu và chân thành. Dale Carnegie đưa ra những nguyên tắc vàng trong việc ứng xử, từ cách khơi gợi sự hợp tác đến việc thay đổi người khác mà không gây ra sự oán giận. Những bài học trong sách vẫn giữ nguyên giá trị theo thời gian, giúp mỗi cá nhân trở nên tinh tế hơn trong giao tiếp xã hội và thành công hơn trong cuộc sống.'),(8,'7 Thói Quen Thành Đạt','Stephen Covey',190000,'/static/images/7thoiquen.jpg',45,3,'Cuốn sách không chỉ đưa ra những lời khuyên đơn thuần mà thiết lập một hệ thống tư duy sâu sắc để thay đổi cuộc đời từ bên trong. Bằng cách tập trung vào các thói quen như \"luôn chủ động\", \"bắt đầu bằng một mục tiêu\" hay \"tư duy cùng thắng\", Stephen Covey hướng dẫn người đọc cách làm chủ bản thân và phối hợp hiệu quả với người khác. Đây là kim chỉ nam cho những ai đang tìm kiếm sự cân bằng giữa hiệu quả công việc và hạnh phúc cá nhân.'),(9,'Atomic Habits','James Clear',250000,'/static/images/atomichabits.jpg',60,3,'James Clear tập trung vào sức mạnh của những thay đổi cực nhỏ nhưng có tính lặp lại hàng ngày để tạo nên những chuyển biến khổng lồ trong dài hạn. Cuốn sách cung cấp một khung làm việc khoa học dựa trên tâm lý học hành vi để giúp bạn loại bỏ thói quen xấu và hình thành những thói quen tốt một cách tự nhiên. Thông điệp cốt lõi là đừng quá áp lực với những mục tiêu vĩ đại, hãy tập trung vào việc cải thiện 1% mỗi ngày để đạt được thành tựu đột phá.'),(10,'Nhà Giả Kim','Paulo Coelho',79000,'/static/images/nhagiakim.jpg',120,4,'Đây là một câu chuyện ngụ ngôn đầy mê hoặc về hành trình theo đuổi vận mệnh của chàng chăn cừu Santiago. Qua những trải nghiệm trên đường đi tìm kho báu, tác giả Paulo Coelho nhắn nhủ rằng kho báu đích thực thường nằm ở ngay dưới chân chúng ta và lòng dũng cảm để lắng nghe trái tim chính là chìa khóa để mở ra mọi cánh cửa. Cuốn sách là lời cổ vũ chân thành cho bất kỳ ai đang ấp ủ ước mơ nhưng còn e sợ trước những thử thách của cuộc đời.'),(11,'Mắt Biếc','Nguyễn Nhật Ánh',110000,'/static/images/matbiec.jpg',80,4,'Đây là một trong những tác phẩm tiêu biểu nhất của nhà văn Nguyễn Nhật Ánh, khắc họa một câu chuyện tình đơn phương đầy day dứt và đẹp đẽ. Qua ngòi bút đậm chất thơ, tác giả đưa người đọc về với ngôi làng Đo Đo, nơi có những kỷ niệm tuổi thơ trong sáng và đôi mắt biếc sâu thẳm của nhân vật Hà Lan. Cuốn sách là một bản nhạc buồn về tình yêu, sự thủy chung và nỗi hoài niệm về một thời quá khứ không thể quay trở lại, chạm đến những rung cảm nhẹ nhàng nhất trong lòng độc giả.'),(12,'Số Đỏ','Vũ Trọng Phụng',65000,'/static/images/sodo.jpg',40,4,'Được coi là đỉnh cao của văn học hiện thực trào phúng Việt Nam, Số Đỏ là một bức tranh biếm họa sắc sảo về xã hội thành thị những năm 1930. Hành trình \"đổi đời\" đầy kịch tính của Xuân Tóc Đỏ từ một kẻ nhặt banh quần vợt thành bậc vĩ nhân xã hội không chỉ mang lại tiếng cười sảng khoái mà còn lên án gay gắt sự lố lăng, giả dối của tầng lớp thượng lưu rởm thời bấy giờ. Tác phẩm vẫn giữ nguyên tính thời đại với những bài học sâu cay về giá trị con người và sự vận hành kỳ lạ của xã hội.'),(13,'IELTS Trainer 2','Cambridge',320000,'/static/images/ielts.jpg',20,5,'Đây là bộ tài liệu thực hành chuyên sâu dành cho những sĩ tử đang trong giai đoạn nước rút chuẩn bị cho kỳ thi IELTS. Cuốn sách cung cấp các bài thi thử sát với thực tế, đi kèm với những hướng dẫn chi tiết và mẹo làm bài cho cả 4 kỹ năng: Nghe, Nói, Đọc, Viết. Với các bài tập bổ trợ tập trung vào những lỗi sai thường gặp, đây là công cụ đắc lực giúp người học hệ thống lại kiến thức, rèn luyện áp lực thời gian và tự tin đạt được mức điểm mục tiêu.'),(14,'English Grammar in Use','Raymond Murphy',180000,'/static/images/grammar.jpg',55,5,'Được mệnh danh là cuốn sách \"gối đầu giường\" của hàng triệu người học tiếng Anh trên toàn thế giới, tác phẩm của Raymond Murphy nổi tiếng nhờ cách trình bày logic và dễ hiểu. Mỗi bài học được thiết kế trên một trang lý thuyết đi kèm một trang bài tập thực hành, giúp người học nắm vững các cấu trúc ngữ pháp từ cơ bản đến nâng cao. Đây là tài liệu chuẩn mực giúp bạn xây dựng nền tảng ngôn ngữ vững chắc, phục vụ cho cả giao tiếp hàng ngày lẫn học thuật chuyên sâu.'),(15,'Lược Sử Thời Gian','Stephen Hawking',145000,'/static/images/luocsuthoigian.jpg',15,6,'Cuốn sách này là một nỗ lực phi thường của nhà vật lý thiên văn Stephen Hawking trong việc đưa những khái niệm phức tạp về vũ trụ đến gần hơn với công chúng. Từ vụ nổ Big Bang, lỗ đen cho đến bản chất của thời gian và không gian, Hawking dẫn dắt người đọc đi xuyên qua các học thuyết vật lý hiện đại bằng ngôn ngữ dễ hiểu và lôi cuốn. Tác phẩm không chỉ cung cấp kiến thức khoa học mà còn khơi gợi trí tò mò vô tận về nguồn gốc và định mệnh của toàn bộ vũ trụ.'),(16,'Vũ Trụ','Carl Sagan',280000,'/static/images/vutru.jpg',12,6,'Vũ Trụ của Carl Sagan không đơn thuần là một cuốn sách khoa học, mà là một áng văn chương đầy cảm hứng về vị thế của con người trong không gian bao la. Tác giả kết hợp nhuần nhuyễn giữa thiên văn học, triết học và lịch sử nhân loại để kể về quá trình chúng ta khám phá thế giới xung quanh. Cuốn sách nhắc nhở chúng ta về sự quý giá của \"chấm xanh mờ\" — Trái Đất — và khuyến khích mỗi cá nhân hãy không ngừng học hỏi để thấu hiểu bản chất của sự sống.'),(17,'Tâm Lý Học Tội Phạm','Nhiều tác giả',135000,'/static/images/tamlytoi-pham.jpg',25,7,'Đây là một hành trình đi sâu vào bóng tối của tâm trí con người, nơi những hành vi lệch lạc và tội ác được mổ xẻ dưới góc độ khoa học. Cuốn sách phân tích các động cơ, quá trình hình thành nhân cách và các yếu tố môi trường tác động đến hành vi phạm tội. Qua đó, người đọc không chỉ có thêm kiến thức về tâm lý học hành vi mà còn hiểu rõ hơn về các biện pháp phòng ngừa, giúp xây dựng một cái nhìn đa chiều và thấu đáo hơn về các vấn đề an ninh xã hội.'),(18,'Phi Lý Trí','Dan Ariely',155000,'/static/images/philytri.jpg',18,7,'Bằng những thí nghiệm thực tế đầy thú vị, Dan Ariely đã chứng minh rằng con người không hề hành động lý trí như chúng ta vẫn tưởng. Chúng ta thường đưa ra những quyết định sai lầm một cách có hệ thống trong việc mua sắm, ăn uống hay quản lý thời gian. Cuốn sách giúp bạn nhận diện những \"cái bẫy\" tâm lý này, từ đó đưa ra những lựa chọn thông minh hơn và làm chủ cuộc sống tốt hơn trong một thế giới đầy rẫy những sự cám dỗ phi logic.'),(19,'Vô Cùng Tàn Nhẫn Vô Cùng Yêu Thương','Sara Imas',115000,'/static/images/yeuthuong.jpg',35,8,'Tác phẩm mang đến một góc nhìn mới mẻ và có phần \"ngược đời\" về phương pháp giáo dục con cái của người Do Thái. Tác giả nhấn mạnh rằng tình yêu thương đích thực không phải là sự bao bọc quá mức, mà là việc rèn luyện cho trẻ sự tự lập, khả năng sinh tồn và trách nhiệm với bản thân từ sớm. Bằng sự kết hợp giữa văn hóa phương Đông và trí tuệ Do Thái, cuốn sách là lời cảnh tỉnh cho các bậc phụ huynh về việc nuôi dạy con sao cho con có thể đứng vững trên đôi chân của mình.'),(20,'Nuôi Con Không Phải Là Cuộc Chiến','Bubu Hương',140000,'/static/images/nuoicon.jpg',40,8,'Cuốn sách là một cẩm nang hiện thực hóa hành trình làm cha mẹ theo hướng khoa học và thư thái. Tập trung vào các phương pháp thiết lập nếp sinh hoạt tự nhiên cho trẻ (như EASY), tác giả giúp các bậc phụ huynh hiểu được tâm lý và nhu cầu của trẻ theo từng giai đoạn phát triển. Thay vì những áp lực và mệt mỏi, cuốn sách hướng tới việc xây dựng một môi trường gia đình hạnh phúc, nơi cha mẹ và con cái có thể thấu hiểu và tận hưởng thời gian bên nhau một cách trọn vẹn nhất.'),(21,'Doraemon Tuyển tập','Fujiko F. Fujio',35000,'/static/images/doraemon.jpg',150,9,'Đây là biểu tượng bất hủ của tuổi thơ nhiều thế hệ, xoay quanh chú mèo máy đến từ tương lai và nhóm bạn Nobita, Shizuka, Jaian, Suneo. Qua những bảo bối kỳ diệu và các chuyến phiêu lưu vượt thời gian, tác phẩm không chỉ kích thích trí tưởng tượng vô hạn mà còn lồng ghép những bài học cảm động về tình bạn, lòng nhân ái và ý thức bảo vệ môi trường.'),(22,'Thám Tử Conan - Tập 100','Gosho Aoyama',25000,'/static/images/conan.jpg',300,9,'Cột mốc tập 100 đánh dấu một hành trình bền bỉ của chàng thám tử bị teo nhỏ Edogawa Conan trong cuộc đối đầu với Tổ chức Áo đen bí ẩn. Cuốn truyện tiếp tục lôi cuốn độc giả bằng những vụ án hóc búa, đòi hỏi tư duy logic sắc bén và khả năng quan sát tinh tế. Đây không chỉ là hành trình phá án mà còn là câu chuyện về chính nghĩa và sự kiên trì đi tìm sự thật cuối cùng.'),(23,'One Piece','Eiichiro Oda',25000,'/static/images/onepiece.jpg',500,9,'Được mệnh danh là bộ manga bán chạy nhất lịch sử, One Piece kể về hành trình của Luffy và băng hải tặc Mũ Rơm trên con đường chinh phục kho báu huyền thoại. Tác phẩm xây dựng một thế giới đồ sộ với các giá trị về tự do, ước mơ và sự gắn kết đồng đội. Mỗi hòn đảo họ đi qua là một câu chuyện về văn hóa, chính trị và khát vọng vươn lên chống lại sự áp bức.'),(24,'Dragon Ball','Akira Toriyama',22000,'/static/images/dragonball.jpg',100,9,'Hành trình của chú bé đuôi khỉ Son Goku từ những ngày đầu tầm sư học đạo cho đến khi trở thành người bảo vệ Trái Đất là một thiên anh hùng ca về nghị lực. Dragon Ball định nghĩa lại dòng truyện tranh võ thuật với những trận chiến rực lửa, tinh thần thượng võ và niềm tin rằng sự nỗ lực không ngừng nghỉ có thể vượt qua mọi giới hạn của bản thân.'),(25,'Naruto - Tập 1','Masashi Kishimoto',22000,'/static/images/naruto.jpg',80,9,'Câu chuyện về một cậu bé bị dân làng hắt hủi nhưng luôn nuôi ước mơ trở thành Hokage vĩ đại nhất đã truyền cảm hứng cho hàng triệu người. Naruto không chỉ là những màn nhẫn thuật đẹp mắt mà còn là chiều sâu tâm lý về nỗi cô đơn, sự thấu hiểu và sức mạnh của việc thay đổi số phận bằng tình yêu thương và sự kiên định.'),(26,'Thanh Gươm Diệt Quỷ','Koyoharu Gotouge',30000,'/static/images/demonslayer.jpg',120,9,'Lấy bối cảnh Nhật Bản thời Taisho, bộ truyện kể về cuộc chiến khốc liệt giữa các thợ săn quỷ và loài quỷ dữ. Trung tâm của tác phẩm là tình anh em gắn bó giữa Tanjiro và Nezuko. Với nét vẽ tinh tế và cốt truyện xúc động, tác phẩm ca ngợi lòng dũng cảm, sự hy sinh và tính thiện lương ngay cả trong những hoàn cảnh tăm tối nhất.'),(27,'Chú Thuật Hồi Chiến','Gege Akutami',30000,'/static/images/jjk.jpg',90,9,'Đây là một trong những bộ manga hiện đại ăn khách nhất, khai thác đề tài lời nguyền và các chú thuật sư. Tác phẩm cuốn hút bởi nhịp độ nhanh, các trận chiến đầy chiến thuật và sự mổ xẻ những góc tối trong cảm xúc con người – nơi khởi nguồn của các lời nguyền. Bộ truyện mang đến cái nhìn mới mẻ và có phần gai góc về sự sống và cái chết.'),(28,'Spy x Family','Tatsuya Endo',40000,'/static/images/spyfamily.jpg',200,9,'Một câu chuyện thú vị về gia đình \"hờ\" gồm một điệp viên, một sát thủ và một cô bé có khả năng đọc suy nghĩ. Dù đến với nhau vì những mục đích riêng tư, nhưng sự gắn kết giữa họ dần trở nên chân thật và ấm áp. Tác phẩm là sự pha trộn hoàn hảo giữa yếu tố hành động kịch tính, hài hước nhẹ nhàng và những giá trị về hạnh phúc gia đình.'),(29,'Dấu Ấn Rồng Thiêng','Riku Sanjo',25000,'/static/images/dauanrongthieng.jpg',50,9,'Dựa trên thế giới của trò chơi điện tử nổi tiếng, bộ truyện kể về hành trình của chàng trai trẻ Dai trong cuộc chiến chống lại quân đoàn Ma vương. Đây là tác phẩm mang đậm phong cách phiêu lưu giả tưởng cổ điển, nơi lòng dũng cảm của các anh hùng nhỏ tuổi được thử thách để bảo vệ sự bình yên cho thế giới.'),(30,'Tí Quậy','Đào Hải',35000,'/static/images/tiquay.jpg',60,9,'Là đại diện tiêu biểu của truyện tranh Việt Nam, Tí Quậy mang đến những tiếng cười giòn giã qua những trò nghịch ngợm \"nhất quỷ nhì ma\" của hai bạn Tí và Tèo. Những câu chuyện gần gũi về trường lớp, gia đình và bạn bè không chỉ giúp giải trí mà còn khéo léo lồng ghép những bài học giáo dục đạo đức nhẹ nhàng cho lứa tuổi học trò.');
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
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
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(1000) NOT NULL,
  `message` text NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `reply_message` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_contacts_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,NULL,1,1,450000),(2,NULL,3,1,550000),(3,NULL,2,1,120000),(4,NULL,3,1,550000),(5,NULL,2,1,120000),(6,5,3,2,550000),(7,NULL,3,1,550000),(8,NULL,3,1,550000),(9,8,3,1,550000),(10,8,4,1,125000),(11,NULL,1,1,450000);
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (5,1100000,'Success',1,'2026-04-05 08:33:34'),(8,675000,'Success',3,'2026-04-05 08:40:15');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `otp_code` varchar(6) NOT NULL,
  `is_used` tinyint(1) DEFAULT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `ix_password_reset_tokens_id` (`id`),
  CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
INSERT INTO `password_reset_tokens` VALUES (1,4,'180481',1,'2026-04-21 06:59:01','2026-04-21 06:49:01');
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
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
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `ix_users_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'bao_admin','admin123','admin',NULL),(3,'Ngo Bao','Bao123','user',NULL),(4,'user','user1234','user','user@gmail.com');
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

-- Dump completed on 2026-04-23 16:55:40
