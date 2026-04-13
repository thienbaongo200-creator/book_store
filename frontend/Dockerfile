# Sử dụng đúng phiên bản Node 24 (bản alpine để cực nhẹ)
FROM node:24-alpine

# Đặt thư mục làm việc bên trong container
WORKDIR /app

# Copy các file quản lý thư viện trước
COPY package*.json ./

# Cài đặt thư viện (Dùng npm install)
RUN npm install

# Copy toàn bộ code frontend của bạn vào
COPY . .

# Mở cổng 5173 của Vite
EXPOSE 5173

# Chạy Vite với flag --host để truy cập được từ bên ngoài
CMD ["npm", "run", "dev", "--", "--host"]