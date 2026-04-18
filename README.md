# ĐỒ ÁN MÔN HỌC: PHÁT TRIỂN PHẦN MỀM MÃ NGUỒN MỞ
## Đề tài: XÂY DỰNG WEBSITE BÁN SÁCH TRÊN NỀN TẢNG LINUX MINT


### THÔNG TIN CHUNG
* **Đơn vị:** Khoa Công nghệ thông tin - Trường Đại học Tài nguyên và Môi trường TP.HCM
* **Giảng viên hướng dẫn:** ThS. Trần Văn Định
* **Thực hiện:** Nhóm 1
   1. Ngô Quốc Thiên Bảo_1250080015
   2. Nguyễn Minh Chiến_1250080024
   3. Nguyễn Văn Danh_1250080027


---

### 1. TỔNG QUAN HỆ THỐNG
Hệ thống được xây dựng trên kiến trúc tách biệt (**Decoupled Architecture**) giữa Frontend và Backend, giúp tối ưu hóa khả năng bảo trì và mở rộng độc lập.

* **Frontend:** React 19 (Vite) - Đảm nhiệm vai trò render giao diện người dùng và xử lý tương tác bản đồ số qua thư viện Leaflet.
* **Backend:** FastAPI (Python 3.12) - Cung cấp RESTful API, quản lý logic nghiệp vụ, xác thực và tương tác cơ sở dữ liệu qua ORM.
* **Database:** MySQL Server - Lưu trữ dữ liệu quan hệ, quản lý thông tin sản phẩm, người dùng và giao dịch.
* **Orchestration:** Docker Compose - Quản lý việc kết nối và vận hành đồng bộ các dịch vụ.
---

### 2. DANH MỤC CÔNG NGHỆ (TECH STACK)

| Thành phần | Công nghệ sử dụng | Vai trò chi tiết |
| :--- | :--- | :--- |
| **Containerization** | Docker & Docker Compose | Đóng gói toàn bộ ứng dụng |
| **Backend Framework** | FastAPI | Framework ASGI hiệu năng cao cho Python |
| **ORM** | SQLAlchemy | Quản lý truy vấn cơ sở dữ liệu dưới dạng đối tượng |
| **Database Driver** | PyMySQL | Kết nối trực tiếp giữa Python và MySQL |
| **Validation** | Pydantic | Kiểm soát và xác thực cấu trúc dữ liệu đầu vào/đầu ra |
| **Web UI** | React 19 | Thư viện xây dựng giao diện người dùng thành phần |
| **Build Tool** | Vite | Tối ưu hóa tốc độ đóng gói và phản hồi Frontend |

---

### 3. CẤU TRÚC THƯ MỤC DỰ ÁN

| Thư mục/Tệp | Vai trò |
|-------------|---------|
| **backend/** | Mã nguồn máy chủ FastAPI |
| ├── **Dockerfile** | Cấu hình build image cho Backend |
| ├── **requirements.txt** | Danh sách thư viện Python |
| ├── **main.py** | Khởi tạo ứng dụng và định nghĩa Endpoints |
| ├── **models.py** | Định nghĩa cấu trúc Database (ORM) |
| ├── **schemas.py** | Định nghĩa kiểu dữ liệu truyền tải (Pydantic) |
| ├── **database.py** | Cấu hình kết nối hệ quản trị cơ sở dữ liệu |
| └── **static/images/** | Kho lưu trữ hình ảnh sản phẩm (demo) |
| **frontend/** | Mã nguồn ứng dụng React |
| ├── **Dockerfile** | Cấu hình build image cho Frontend |
| ├── **package.json** | Danh sách thư viện Node.js |
| ├── **vite.config.js** | Cấu hình Vite cho Frontend |
| ├── **eslint.config.js, postcss.config.js, tailwind.config.js** | Cấu hình bổ trợ cho frontend |
| ├── **src/** | Logic xử lý, giao diện và dịch vụ API |
| ├── **public/** | Tài nguyên tĩnh phía máy khách (favicon, icons) |
| └── **index.html** | File HTML gốc |
| **database_backup.sql** | Tệp tin sao lưu cấu trúc và dữ liệu MySQL |
| **docker-compose.yml** | Tệp điều phối toàn bộ hệ thống |
| **README.md** | Tài liệu mô tả dự án |

### 4. QUY TRÌNH CÀI ĐẶT VÀ VẬN HÀNH
#### Bước 1. Cài đặt Docker trên Linux Mint
- Tải **Visual Studio Code** cho Linux Mint (.deb): [Download VS Code](https://code.visualstudio.com/download)
- Mở Terminal và chạy các lệnh sau:
  ```bash
   sudo apt update
   sudo apt install docker.io -y
   sudo apt install docker-compose -y
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -aG docker $USER
#### Bước 2. Chuẩn bị mã nguồn
- Cài đặt Git:
  ```bash
  sudo apt install git -y
- Clone Repository từ GitHub trong Visual Studio Code:
   ```bash
   git clone https://github.com/thienbaongo200-creator/book_store.git
   cd book_store
#### Bước 3. Triển khai với Docker Compose
- Lưu ý: Nếu máy đang cài sẵn MySQL, hãy giải phóng cổng 3306 trước:
   ```bash
   sudo systemctl stop mysql
- Chạy lệnh để build và chạy toàn bộ hệ thống: 
   ```bash
   sudo apt install python3-setuptools python3-pip -y
   sudo docker-compose up --build
- Nếu bị lỗi backend, thêm user vào nhóm docker rồi build lại
   ```bash 
   sudo usermod -aG docker $USER
#### Bước 4: Kiểm tra trạng thái hệ thống
- Kiểm tra các container đang chạy:
   ```bash
   docker ps
- Nếu dữ liệu chưa được import tự động, bạn có thể chạy lệnh thủ công sau:
   ```bash
   docker exec -i book_store-db-1 mysql -u root -padmin bookstore_db < database_backup.sql
#### Bước 5: ĐỊA CHỈ TRUY CẬP
- Giao diện người dùng: http://localhost:5173
- Hệ thống API (Swagger UI): http://localhost:8000/docs
---
### 5. CÁC TÍNH NĂNG TRỌNG TÂM
- Quản lý danh mục: Hỗ trợ tìm kiếm, lọc theo loại và xem chi tiết sản phẩm trực quan.
- Hệ thống giỏ hàng: Xử lý lưu trữ phiên làm việc, kiểm soát số lượng dựa trên tồn kho thực tế.
- Quy trình đơn hàng: Tính toán giá trị giao dịch tự động tại Server và cập nhật trạng thái kho.
- Xác thực người dùng: Hệ thống đăng ký, đăng nhập và phân quyền để quản lý đơn hàng cá nhân.
- Static Server: Cấu hình phục vụ hình ảnh sản phẩm trực tiếp từ backend, tối ưu hóa đường dẫn tĩnh.
