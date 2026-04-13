# Sử dụng đúng phiên bản Python 3.12 (bản slim để nhẹ máy)
FROM python:3.12-slim

# Thiết lập thư mục làm việc
WORKDIR /app

# Ngăn Python tạo ra các file .pyc và cho phép log hiển thị ngay lập tức
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Copy và cài đặt thư viện từ file pip freeze bạn đã làm
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ code vào
COPY . .

EXPOSE 8000

# Lệnh khởi chạy
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]