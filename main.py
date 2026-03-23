from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import SessionLocal, engine

# Tạo bảng tự động dựa trên models (Nếu chưa có trong MySQL)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hệ thống Quản lý Nhà sách - Team Bảo",
    description="API quản lý sách chạy trên Linux, MySQL và FastAPI",
    version="1.0.0"
)

# Dependency: Hàm lấy kết nối Database cho mỗi request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- CÁC ENDPOINTS (ĐƯỜNG DẪN API) ---

@app.get("/", tags=["Trang chủ"])
def read_root():
    """Trang chào mừng để tránh lỗi Not Found"""
    return {
        "message": "Chào mừng Bảo đến với Backend Nhà sách!",
        "status": "Online",
        "swagger_docs": "/docs"
    }

# 1. LẤY DANH SÁCH TẤT CẢ SÁCH (READ)
@app.get("/books/", response_model=List[schemas.BookResponse], tags=["Quản lý Sách"])
def read_books(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    books = db.query(models.Book).offset(skip).limit(limit).all()
    return books

# 2. LẤY CHI TIẾT 1 CUỐN SÁCH THEO ID
@app.get("/books/{book_id}", response_model=schemas.BookResponse, tags=["Quản lý Sách"])
def read_book(book_id: int, db: Session = Depends(get_db)):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if db_book is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách!")
    return db_book

# 3. THÊM SÁCH MỚI (CREATE)
@app.post("/books/", response_model=schemas.BookResponse, tags=["Quản lý Sách"])
def create_book(book: schemas.BookCreate, db: Session = Depends(get_db)):
    # model_dump() chuyển dữ liệu từ Pydantic sang Dictionary để nạp vào DB
    db_book = models.Book(**book.model_dump())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

# 4. CẬP NHẬT THÔNG TIN SÁCH (UPDATE)
@app.put("/books/{book_id}", response_model=schemas.BookResponse, tags=["Quản lý Sách"])
def update_book(book_id: int, book_update: schemas.BookUpdate, db: Session = Depends(get_db)):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách để cập nhật!")
    
    # Chỉ cập nhật các trường được gửi lên (exclude_unset=True)
    update_data = book_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_book, key, value)
    
    db.commit()
    db.refresh(db_book)
    return db_book

# 5. XÓA SÁCH (DELETE)
@app.delete("/books/{book_id}", tags=["Quản lý Sách"])
def delete_book(book_id: int, db: Session = Depends(get_db)):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Sách không tồn tại để xóa!")
    
    db.delete(db_book)
    db.commit()
    return {"message": f"Đã xóa thành công sách có ID: {book_id}"}