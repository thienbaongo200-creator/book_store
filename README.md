📚 XÂY DỰNG WEBSITE  BÁN SÁCH BẰNG PHẦN MỀM MÃ NGUỒN MỞ LIXNUX MINT_Nhóm 1
Đồ án môn học: PHÁT TRIỂN PHẦN MỀM MÃ NGUỒN MỞ
Giảng viên hướng dẫn: Ths. Trần Văn Định
Trường: Đại học Tài nguyên và Môi trường TP.HCM (HCMUNRE)

🏗️ Tổng quan kiến trúc hệ thống
Hệ thống được xây dựng theo mô hình Client-Server, tích hợp WebGIS để quản lý vị trí các chi nhánh và điều phối kho hàng.

Frontend: React 19 (Vite) - Xử lý giao diện người dùng và tương tác bản đồ.

Backend: FastAPI (Python 3.12) - Cung cấp RESTful API, xử lý Logic nghiệp vụ và xác thực dữ liệu.

Database: MySQL Server - Lưu trữ dữ liệu quan hệ, quản lý ràng buộc và giao dịch (Transactions).

🛠️ Chi tiết môi trường phát triển (Tech Stack)
1. Backend (Python v3.12.x)
Môi trường ảo venv đảm bảo tính đóng gói với các thư viện:

FastAPI (v0.135.1): Framework chính cho hiệu suất cao.

SQLAlchemy (v2.0.48): ORM mạnh mẽ để tương tác với MySQL.

PyMySQL (v1.1.2): Driver kết nối Database.

Pydantic (v2.12.5): Kiểm định dữ liệu đầu vào/đầu ra (Schemas).

Uvicorn (v0.42.0): ASGI Server vận hành ứng dụng.

2. Frontend (React v19.2.4)
Tối ưu hóa trải nghiệm người dùng với các công cụ:

Vite (v8.0.1): Build tool thế hệ mới cho tốc độ phản hồi cực nhanh.

Axios (v1.13.6): Thư viện gọi API chuyên dụng.

React Router DOM (v7.13.1): Quản lý điều hướng trang.

Tailwind CSS (v4.2.2): Framework CSS hiện đại giúp tùy biến UI nhanh chóng.

Leaflet: Thư viện bản đồ số phục vụ tính năng WebGIS.

📂 Cấu trúc thư mục dự án
Plaintext
bookstore_backend/
├── frontend/                # Mã nguồn React (Vite)
│   ├── src/                 # Components, Pages, API Services
│   ├── public/              # Tài nguyên tĩnh Frontend
│   └── package.json         # Danh sách thư viện Node.js
├── backend/                 # Mã nguồn FastAPI
│   ├── main.py              # Luồng xử lý Endpoints (API chính)
│   ├── models.py            # Định nghĩa thực thể Database (ORM)
│   ├── schemas.py           # Pydantic Schemas (Validation)
│   ├── database.py          # Cấu hình Engine kết nối MySQL
│   └── static/images/       # Kho chứa ảnh bìa sách (Clean Code, Python...)
├── venv/                    # Môi trường ảo Python
└── database_backup.sql      # File sao lưu cấu hình & dữ liệu MySQL
🚀 Hướng dẫn cài đặt & Khởi chạy (Linux/Ubuntu)
Bước 1: Thiết lập Database
Mở MySQL Terminal: mysql -u root -p

Tạo database: CREATE DATABASE bookstore_db;

Nạp dữ liệu mẫu: mysql -u root -p bookstore_db < database_backup.sql

Bước 2: Khởi chạy Backend
Bash
# Di chuyển vào thư mục dự án
cd bookstore_backend
# Kích hoạt môi trường ảo
source venv/bin/activate
# Chạy server (mặc định tại port 8000)
uvicorn backend.main:app --reload
👉 Tài liệu API: http://127.0.0.1:8000/docs

Bước 3: Khởi chạy Frontend
Bash
cd frontend
npm install
npm run dev
👉 Giao diện Web: http://localhost:5173

🛡️ Các chức năng trọng tâm đã hoàn thiện
Quản lý Giỏ hàng (Cart Logic): Tự động gán user_id, cộng dồn số lượng và kiểm tra tính toàn vẹn dữ liệu qua Pydantic.

Thanh toán & Đơn hàng (Order Logic): Tự động tính tổng tiền từ Database, trừ tồn kho (stock) và dọn dẹp giỏ hàng sau khi chốt đơn thành công.

Xử lý Static Files: Cấu hình thư mục tĩnh phục vụ hiển thị ảnh bìa sách trực tiếp từ Server Backend.

CORS Policy: Đã cấu hình cho phép Frontend React gọi API xuyên suốt các cổng khác nhau.

📝 Nhật ký cập nhật (Changelog)
✅ v1.3.1: Sửa lỗi ResponseValidationError do giá trị NULL trong Database.

✅ v1.3.0: Cập nhật Schema bảng cart_items, thêm cột user_id và thiết lập khóa ngoại.

✅ v1.2.0: Hoàn thiện Logic thanh toán tự động và trừ kho hàng.