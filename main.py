from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional # Thêm Optional để chuẩn hóa type
import models, schemas
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware

# Tạo bảng tự động
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hệ thống Quản lý Nhà sách - Team Bảo",
    description="API quản lý sách chạy trên Linux, MySQL và FastAPI",
    version="1.0.0"
)

# Cấu hình CORS - Cho phép cả localhost và 127.0.0.1 để tránh lỗi trình duyệt
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- CÁC ENDPOINTS ---

@app.get("/", tags=["Trang chủ"])
def read_root():
    return {
        "message": "Chào mừng Bảo đến với Backend Nhà sách!",
        "status": "Online",
        "swagger_docs": "/docs"
    }

# 1. LẤY DANH SÁCH SÁCH + TÌM KIẾM (Gộp chung vào 1 hàm duy nhất)
@app.get("/books/", response_model=List[schemas.BookResponse], tags=["Quản lý Sách"])
def read_books(search: Optional[str] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(models.Book)
    
    if search:
        # Sử dụng ilike để tìm kiếm không phân biệt hoa thường (nếu MySQL hỗ trợ)
        # Hoặc dùng contains như cũ
        query = query.filter(models.Book.title.contains(search))
    
    books = query.offset(skip).limit(limit).all()
    return books

# 2. LẤY CHI TIẾT 1 CUỐN SÁCH
@app.get("/books/{book_id}", response_model=schemas.BookResponse, tags=["Quản lý Sách"])
def read_book(book_id: int, db: Session = Depends(get_db)):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if db_book is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách!")
    return db_book

# 3. THÊM SÁCH MỚI
@app.post("/books/", response_model=schemas.BookResponse, tags=["Quản lý Sách"])
def create_book(book: schemas.BookCreate, db: Session = Depends(get_db)):
    db_book = models.Book(**book.model_dump())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

# 4. CẬP NHẬT THÔNG TIN SÁCH
@app.put("/books/{book_id}", response_model=schemas.BookResponse, tags=["Quản lý Sách"])
def update_book(book_id: int, book_update: schemas.BookUpdate, db: Session = Depends(get_db)):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách!")
    
    update_data = book_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_book, key, value)
    
    db.commit()
    db.refresh(db_book)
    return db_book

# 5. XÓA SÁCH
@app.delete("/books/{book_id}", tags=["Quản lý Sách"])
def delete_book(book_id: int, db: Session = Depends(get_db)):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Sách không tồn tại!")
    
    db.delete(db_book)
    db.commit()
    return {"message": f"Đã xóa thành công sách ID {book_id}"}