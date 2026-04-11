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

---

### 2. DANH MỤC CÔNG NGHỆ (TECH STACK)

| Thành phần | Công nghệ sử dụng | Vai trò chi tiết |
| :--- | :--- | :--- |
| **Backend Framework** | FastAPI | Framework ASGI hiệu năng cao cho Python |
| **ORM** | SQLAlchemy | Quản lý truy vấn cơ sở dữ liệu dưới dạng đối tượng |
| **Database Driver** | PyMySQL | Kết nối trực tiếp giữa Python và MySQL |
| **Validation** | Pydantic | Kiểm soát và xác thực cấu trúc dữ liệu đầu vào/đầu ra |
| **Web UI** | React 19 | Thư viện xây dựng giao diện người dùng thành phần |
| **Build Tool** | Vite | Tối ưu hóa tốc độ đóng gói và phản hồi Frontend |
| **GIS Component** | Leaflet | Hiển thị và xử lý các lớp bản đồ tương tác |

---

### 3. CẤU TRÚC THƯ MỤC DỰ ÁN

| Thư mục/Tệp | Vai trò |
|-------------|---------|
| frontend/ | Mã nguồn ứng dụng React |
| ├── src/ | Logic xử lý, giao diện và dịch vụ API |
| ├── public/ | Tài nguyên tĩnh phía máy khách |
| └── package.json | Danh sách thư viện Node.js |
| backend/ | Mã nguồn máy chủ FastAPI |
| ├── main.py | Khởi tạo ứng dụng và định nghĩa Endpoints |
| ├── models.py | Định nghĩa cấu trúc Database (ORM) |
| ├── schemas.py | Định nghĩa kiểu dữ liệu truyền tải (Pydantic) |
| ├── database.py | Cấu hình kết nối hệ quản trị cơ sở dữ liệu |
| └── static/images/ | Kho lưu trữ hình ảnh sản phẩm |
| venv/ | Môi trường ảo hóa Python |
| database_backup.sql | Tệp tin sao lưu cấu trúc và dữ liệu MySQL |

---

### 4. QUY TRÌNH CÀI ĐẶT VÀ VẬN HÀNH
#### Bước 1. Lấy mã nguồn và công cụ phát triển
- Tải **Visual Studio Code** cho Linux Mint (.deb): [Download VS Code](https://code.visualstudio.com/download)
- Cài đặt Git:
  ```bash
  sudo apt install git
- Clone Repository từ GitHub:
   ```bash
   git clone https://github.com/thienbaongo200-creator/book_store.git
   cd book_store

#### Bước 2. Chuẩn bị môi trường ảo cho Backend
- Cài đặt phần mềm ảo (VMware Workstation) và khởi tạo máy ảo chạy Linux Mint 21+
- Cập nhật hệ thống và cài đặt các gói công cụ cơ bản:
   ```bash
   sudo apt update
   sudo apt install mysql-server python3-pip python3.12-venv
- Tạo và kích hoạt môi trường ảo:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
- Cài đặt các thư viện Python cần thiết
   ```bash
   pip install fastapi uvicorn sqlalchemy pymysql pydantic python-multipart --break-system-packages
#### Bước 3. Thiết lập cơ sở dữ liệu
- Truy cập MySQL Terminal: 
   ```bash
   sudo mysql -u root -p
- (Nếu cần) Khởi động MySQL:
   ```bash
   sudo systemctl start mysql
   sudo systemctl status mysql
- Khởi tạo Database: 
   ```bash
   CREATE DATABASE bookstore_db;
- Thiết lập user root với mật khẩu và quyền:
   ```bash
   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'matkhau123';
   GRANT ALL PRIVILEGES ON bookstore_db.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;

- Phục hồi dữ liệu từ file backup:
   ```bash
   sudo mysql -u root -p bookstore_db < database_backup.sql
#### Bước 4: Triển khai Backend 
- Di chuyển vào thư mục dự án và kích hoạt môi trường ảo:
   ```bash
   source venv/bin/activate
- Khởi động server: 
   ```bash
   uvicorn backend.main:app --reload
- Tài liệu API (Swagger): http://127.0.0.1:8000/docs

#### Bước 5: Triển khai Frontend
- Di chuyển vào thư mục: 
   ```bash
   cd ~/book_store/frontend
- Cài đặt Node.js và npm: 
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm
- Cài đặt các node modules:
   ```bash
   npm install 
- Kiểm tra phiên bản
   ```bash
   node -v
   npm -v
- khởi động ứng dụng: 
   ```bash
   npm run dev
- Địa chỉ truy cập: http://localhost:5173

- (Nếu cần) Nâng cấp bản Node.js lên bản LTS mới nhất
   ```bash
   sudo npm install -g n
   sudo n lts
   hash -r
- (Nếu cần) Xóa node_modules và package-lock.json để cài lại sạch
   ```bash 
   rm -rf node_modules package-lock.json
   npm install
---
### 5. CÁC TÍNH NĂNG TRỌNG TÂM
- Quản lý danh mục: Hỗ trợ tìm kiếm, lọc theo loại và xem chi tiết sản phẩm trực quan.
- Hệ thống giỏ hàng: Xử lý lưu trữ phiên làm việc, kiểm soát số lượng dựa trên tồn kho thực tế.
- Quy trình đơn hàng: Tính toán giá trị giao dịch tự động tại Server và cập nhật trạng thái kho.
- Xác thực người dùng: Hệ thống đăng ký, đăng nhập và phân quyền để quản lý đơn hàng cá nhân.
- Static Server: Cấu hình phục vụ hình ảnh sản phẩm trực tiếp từ backend, tối ưu hóa đường dẫn tĩnh.

