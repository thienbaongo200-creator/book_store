import os
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Import bằng dấu chấm (.) để Python biết tìm ở cùng thư mục backend/
from . import models, schemas
from .database import SessionLocal, engine

# Tự động tạo bảng trong MySQL nếu chưa có
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hệ thống Quản lý Nhà sách - Team Bảo",
    description="API quản lý sách và danh mục chạy trên Linux, MySQL và FastAPI",
    version="1.2.0"
)

# 1. Cấu hình CORS - Giúp Frontend React gọi API không bị chặn
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Cấu hình đường dẫn Static Files (Để hiện ảnh sách)
# Lấy đường dẫn tuyệt đối đến thư mục 'static' nằm cùng cấp với main.py
current_dir = os.path.dirname(os.path.realpath(__file__))
static_path = os.path.join(current_dir, "static")

# Tạo thư mục static/images nếu Bảo chưa tạo tay
os.makedirs(os.path.join(static_path, "images"), exist_ok=True)

# Mount thư mục static để truy cập qua URL: http://127.0.0.1:8000/static/...
app.mount("/static", StaticFiles(directory=static_path), name="static")

# Dependency để kết nối Database
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
        "docs": "/docs",
        "image_directory": static_path
    }

# --- QUẢN LÝ DANH MỤC (CATEGORIES) ---

@app.get("/categories/", response_model=List[schemas.CategoryResponse], tags=["Danh mục"])
def list_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

@app.post("/categories/", response_model=schemas.CategoryResponse, tags=["Danh mục"])
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    db_category = models.Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

# --- QUẢN LÝ SÁCH (BOOKS) ---

@app.get("/books/", response_model=List[schemas.BookResponse], tags=["Quản lý Sách"])
def read_books(search: Optional[str] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(models.Book)
    if search:
        query = query.filter(models.Book.title.contains(search))
    return query.offset(skip).limit(limit).all()
@app.get("/books/{book_id}", response_model=schemas.BookResponse, tags=["Quản lý Sách"])
def read_book(book_id: int, db: Session = Depends(get_db)):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if db_book is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách!")
    return db_book

@app.post("/books/", response_model=schemas.BookResponse, tags=["Quản lý Sách"])
def create_book(book: schemas.BookCreate, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.id == book.category_id).first()
    if not category:
        raise HTTPException(status_code=400, detail="Danh mục không tồn tại!")
    db_book = models.Book(**book.model_dump())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

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

@app.delete("/books/{book_id}", tags=["Quản lý Sách"])
def delete_book(book_id: int, db: Session = Depends(get_db)):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Sách không tồn tại!")
    db.delete(db_book)
    db.commit()
    return {"message": f"Đã xóa thành công sách ID {book_id}"}

@app.post("/cart/", response_model=schemas.CartItemResponse, tags=["Giỏ hàng"])
def add_to_cart(item: schemas.CartItemCreate, db: Session = Depends(get_db)):
    db_item = db.query(models.CartItem).filter(models.CartItem.book_id == item.book_id).first()
    if db_item:
        db_item.quantity += item.quantity
    else:
        db_item = models.CartItem(**item.model_dump())
        db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
@app.get("/cart/", response_model=List[schemas.CartItemResponse], tags=["Giỏ hàng"])
def get_cart(db: Session = Depends(get_db)):
    return db.query(models.CartItem).all()
@app.delete("/cart/{item_id}", tags=["Giỏ hàng"])
def delete_cart_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.CartItem).filter(models.CartItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Không tìm thấy mục trong giỏ!")
    db.delete(db_item)
    db.commit()
    return {"message": "Đã xóa khỏi giỏ hàng"}