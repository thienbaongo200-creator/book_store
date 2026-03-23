from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import models, schemas
from database import SessionLocal, engine

# 1. Tạo bảng tự động (chạy khi khởi động server)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hệ thống Quản lý Nhà sách - Team Bảo",
    description="API quản lý sách và danh mục chạy trên Linux, MySQL và FastAPI",
    version="1.1.0"
)

# 2. Cấu hình CORS (Cho phép máy thật/Frontend truy cập vào máy ảo)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Dependency: Kết nối Database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ENDPOINTS ---

@app.get("/", tags=["Trang chủ"])
def read_root():
    return {
        "message": "Chào mừng Bảo đến với Backend Nhà sách!",
        "status": "Online",
        "docs": "/docs"
    }

# --- QUẢN LÝ DANH MỤC (CATEGORIES) ---

@app.get("/categories/", response_model=List[schemas.CategoryResponse], tags=["Danh mục"])
def list_categories(db: Session = Depends(get_db)):
    """Lấy tất cả danh mục sách hiện có"""
    return db.query(models.Category).all()

@app.post("/categories/", response_model=schemas.CategoryResponse, tags=["Danh mục"])
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    """Thêm một danh mục mới (Ví dụ: Trinh thám, Nấu ăn...)"""
    db_category = models.Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

# --- QUẢN LÝ SÁCH (BOOKS) ---

@app.get("/books/", response_model=List[schemas.BookResponse], tags=["Quản lý Sách"])
def read_books(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Lấy danh sách sách (có phân trang)"""
    return db.query(models.Book).offset(skip).limit(limit).all()

@app.get("/books/search/", response_model=List[schemas.BookResponse], tags=["Tra cứu"])
def search_books(title: Optional[str] = None, min_price: float = 0, db: Session = Depends(get_db)):
    """Tìm kiếm sách theo tên gần đúng hoặc lọc theo giá tối thiểu"""
    query = db.query(models.Book)
    if title:
        query = query.filter(models.Book.title.contains(title))
    if min_price > 0:
        query = query.filter(models.Book.price >= min_price)
    return query.all()

@app.get("/books/{book_id}", response_model=schemas.BookResponse, tags=["Quản lý Sách"])
def read_book(book_id: int, db: Session = Depends(get_db)):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if db_book is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách!")
    return db_book

@app.post("/books/", response_model=schemas.BookResponse, tags=["Quản lý Sách"])
def create_book(book: schemas.BookCreate, db: Session = Depends(get_db)):
    # Kiểm tra xem category_id có tồn tại không trước khi thêm sách
    category = db.query(models.Category).filter(models.Category.id == book.category_id).first()
    if not category:
        raise HTTPException(status_code=400, detail="Danh mục (category_id) không tồn tại!")
    
    db_book = models.Book(**book.model_dump())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

@app.put("/books/{book_id}", response_model=schemas.BookResponse, tags=["Quản lý Sách"])
def update_book(book_id: int, book_update: schemas.BookUpdate, db: Session = Depends(get_db)):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách để cập nhật!")
    
    update_data = book_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_book, key, value)
    
    db.commit()
    db.refresh(db_book)
    return db_book

@app.delete("/books/{book_id}", tags=["Quản lý Sách"])
def delete_book(book_id: int, db: Session = Depends(get_db)):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Sách không tồn tại để xóa!")
    
    db.delete(db_book)
    db.commit()
    return {"message": f"Đã xóa thành công sách có ID: {book_id}"}