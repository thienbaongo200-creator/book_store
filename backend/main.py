import os
from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Import từ cùng thư mục backend/
from . import models, schemas
from .database import SessionLocal, engine

# Tự động tạo bảng trong MySQL nếu chưa có
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hệ thống Quản lý Nhà sách - Team Bảo",
    description="API quản lý sách tích hợp phân quyền Admin chạy trên Linux",
    version="1.3.0"
)

# 1. Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Cấu hình Static Files cho ảnh sách
current_dir = os.path.dirname(os.path.realpath(__file__))
static_path = os.path.join(current_dir, "static")
os.makedirs(os.path.join(static_path, "images"), exist_ok=True)
app.mount("/static", StaticFiles(directory=static_path), name="static")

# Dependency kết nối Database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- HÀM KIỂM TRA PHÂN QUYỀN (RBAC) ---

def check_admin_role(user_role: str):
    """Kiểm tra nếu không phải admin thì chặn truy cập"""
    if user_role != "admin":
        raise HTTPException(
            status_code=403, 
            detail="Truy cập bị từ chối: Bạn không có quyền Quản trị viên (Admin)!"
        )

# --- CÁC ENDPOINTS ---

@app.get("/", tags=["Hệ thống"])
def read_root():
    return {
        "message": "Chào mừng Bảo đến với Backend Nhà sách!",
        "status": "Online",
        "docs": "/docs"
    }

# --- QUẢN LÝ DANH MỤC (Dành cho cả User và Admin) ---

@app.get("/categories/", response_model=List[schemas.CategoryResponse], tags=["Danh mục"])
def list_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

# --- QUẢN LÝ SÁCH (BOOKS) ---

# 1. Xem danh sách sách (Công khai)
@app.get("/books/", response_model=List[schemas.BookResponse], tags=["Sách"])
def read_books(search: Optional[str] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(models.Book)
    if search:
        query = query.filter(models.Book.title.contains(search))
    return query.offset(skip).limit(limit).all()

# 2. Xem chi tiết 1 cuốn sách (Công khai)
@app.get("/books/{book_id}", response_model=schemas.BookResponse, tags=["Sách"])
def read_book(book_id: int, db: Session = Depends(get_db)):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if db_book is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách!")
    return db_book

# 3. THÊM SÁCH MỚI (Chỉ Admin)
@app.post("/books/", response_model=schemas.BookResponse, tags=["Quản trị - Sách"])
def create_book(
    book: schemas.BookCreate, 
    user_role: str = Query("user"), # Lấy từ tham số query để test nhanh
    db: Session = Depends(get_db)
):
    check_admin_role(user_role)
    category = db.query(models.Category).filter(models.Category.id == book.category_id).first()
    if not category:
        raise HTTPException(status_code=400, detail="Danh mục không tồn tại!")
    
    db_book = models.Book(**book.model_dump())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

# 4. CẬP NHẬT SÁCH (Chỉ Admin)
@app.put("/books/{book_id}", response_model=schemas.BookResponse, tags=["Quản trị - Sách"])
def update_book(
    book_id: int, 
    book_update: schemas.BookUpdate, 
    user_role: str = Query("user"), 
    db: Session = Depends(get_db)
):
    check_admin_role(user_role)
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách!")
    
    update_data = book_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_book, key, value)
    
    db.commit()
    db.refresh(db_book)
    return db_book

# 5. XÓA SÁCH (Chỉ Admin)
@app.delete("/books/{book_id}", tags=["Quản trị - Sách"])
def delete_book(
    book_id: int, 
    user_role: str = Query("user"), 
    db: Session = Depends(get_db)
):
    check_admin_role(user_role)
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Sách không tồn tại!")
    
    db.delete(db_book)
    db.commit()
    return {"message": f"Đã xóa thành công sách ID {book_id}"}