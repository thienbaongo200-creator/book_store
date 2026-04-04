import os
from fastapi import FastAPI, Depends, HTTPException, Query
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session, joinedload
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

# --- QUẢN LÝ DANH MỤC ---
@app.get("/categories/", response_model=List[schemas.CategoryResponse], tags=["Danh mục"])
def list_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

# --- QUẢN LÝ SÁCH ---

@app.get("/books/", response_model=List[schemas.BookResponse], tags=["Sách"])
def read_books(search: Optional[str] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(models.Book)
    if search:
        query = query.filter(models.Book.title.contains(search))
    return query.offset(skip).limit(limit).all()

@app.get("/books/{book_id}", response_model=schemas.BookResponse, tags=["Sách"])
def read_book(book_id: int, db: Session = Depends(get_db)):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if db_book is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách!")
    return db_book

@app.post("/books/", response_model=schemas.BookResponse, tags=["Quản trị - Sách"])
def create_book(
    book: schemas.BookCreate, 
    user_role: str = Query("user"), 
    db: Session = Depends(get_db)
):
    check_admin_role(user_role) # Giữ lại bảo mật của Bảo
    category = db.query(models.Category).filter(models.Category.id == book.category_id).first()
    if not category:
        raise HTTPException(status_code=400, detail="Danh mục không tồn tại!")
    db_book = models.Book(**book.model_dump())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

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

# --- QUẢN LÝ GIỎ HÀNG ---

@app.post("/cart/", response_model=schemas.CartItemResponse, tags=["Giỏ hàng"])
def add_to_cart(item: schemas.CartItemCreate, db: Session = Depends(get_db)):
    db_item = db.query(models.CartItem).filter(
        models.CartItem.book_id == item.book_id,
        models.CartItem.user_id == item.user_id 
    ).first()
    
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

# --- QUẢN LÝ ĐƠN HÀNG (ORDERS) ---

@app.post("/orders/{user_id}", tags=["Đơn hàng"])
def create_order(user_id: int, db: Session = Depends(get_db)):
    # 1. Lấy tất cả món đồ trong giỏ của user này
    cart_items = db.query(models.CartItem).filter(models.CartItem.user_id == user_id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Giỏ hàng trống, không thể thanh toán!")
    
    # 2. Tính tổng tiền
    total = sum(item.book.price * item.quantity for item in cart_items)
    
    # 3. Tạo đơn hàng mới
    new_order = models.Order(user_id=user_id, total_price=total, status="Processing")
    db.add(new_order)
    
    # 4. Xóa giỏ hàng sau khi đã lên đơn
    db.query(models.CartItem).filter(models.CartItem.user_id == user_id).delete()
    
    db.commit()
    db.refresh(new_order)
    return {"message": "Thanh toán thành công!", "order_id": new_order.id, "total": total}

@app.get("/orders/", tags=["Quản trị - Đơn hàng"])
def list_all_orders(user_role: str = Query("user"), db: Session = Depends(get_db)):
    check_admin_role(user_role) 
    return db.query(models.Order).all()
@app.post("/wishlist/", tags=["Yêu thích"])
def add_to_wishlist(item: schemas.WishlistCreate, db: Session = Depends(get_db)):
    # Kiểm tra xem đã yêu thích chưa để tránh trùng lặp
    exists = db.query(models.Wishlist).filter(
        models.Wishlist.book_id == item.book_id, 
        models.Wishlist.user_id == item.user_id
    ).first()
    if exists:
        return {"message": "Đã có trong danh sách yêu thích"}
    
    db_item = models.Wishlist(**item.model_dump())
    db.add(db_item)
    db.commit()
    return {"message": "Đã thêm vào yêu thích"}

@app.get("/wishlist/", tags=["Yêu thích"])
def get_wishlist(db: Session = Depends(get_db)):
    return db.query(models.Wishlist).options(joinedload(models.Wishlist.book)).all()
@app.delete("/wishlist/{wish_id}", tags=["Yêu thích"])
def delete_wishlist_item(wish_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.Wishlist).filter(models.Wishlist.id == wish_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Không tìm thấy mục yêu thích")
    db.delete(db_item)
    db.commit()
    return {"message": "Đã xóa khỏi danh sách yêu thích"}
@app.post("/wishlist/", tags=["Yêu thích"])
def toggle_wishlist(item: schemas.WishlistCreate, db: Session = Depends(get_db)):
    # 1. Kiểm tra xem sách này đã được user này yêu thích chưa
    exists = db.query(models.Wishlist).filter(
        models.Wishlist.book_id == item.book_id, 
        models.Wishlist.user_id == item.user_id
    ).first()

    if exists:
        # 2. Nếu đã tồn tại -> XÓA (Hủy yêu thích)
        db.delete(exists)
        db.commit()
        return {"message": "unfollowed", "status": False} # Trả về status để Frontend biết
    
    # 3. Nếu chưa tồn tại -> THÊM MỚI
    db_item = models.Wishlist(**item.model_dump())
    db.add(db_item)
    db.commit()
    return {"message": "followed", "status": True}
# --- CẬP NHẬT QUẢN LÝ ĐƠN HÀNG (ORDERS) ---

@app.post("/orders/{user_id}", tags=["Đơn hàng"])
def create_order(user_id: int, db: Session = Depends(get_db)):
    # 1. Lấy món đồ trong giỏ kèm thông tin sách để tính tiền
    cart_items = db.query(models.CartItem).filter(models.CartItem.user_id == user_id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Giỏ hàng trống!")
    
    # 2. Tính tổng tiền (Sử dụng thuộc tính price từ bảng Book liên kết)
    total = sum(item.book.price * item.quantity for item in cart_items)
    
    # 3. Tạo đơn hàng mới (Đảm bảo bảng Order của bạn có trường total_price hoặc total)
    new_order = models.Order(user_id=user_id, total_price=total, status="Success")
    db.add(new_order)
    db.commit() # Commit trước để lấy ID đơn hàng
    
    # 4. Xóa giỏ hàng
    db.query(models.CartItem).filter(models.CartItem.user_id == user_id).delete()
    db.commit()
    
    db.refresh(new_order)
    return {"message": "Thanh toán thành công!", "order_id": new_order.id, "total": total}

# ĐÂY LÀ HÀM BẢO ĐANG THIẾU: Lấy lịch sử đơn hàng của 1 User cụ thể
@app.get("/orders/{user_id}", tags=["Đơn hàng"])
def get_user_orders(user_id: int, db: Session = Depends(get_db)):
    orders = db.query(models.Order).filter(models.Order.user_id == user_id).all()
    # Chuyển đổi dữ liệu để khớp với Frontend (đổi total_price thành total nếu cần)
    result = []
    for o in orders:
        result.append({
            "id": o.id,
            "total": o.total_price, # Ép tên trường về 'total' cho giống React
            "status": o.status,
            "created_at": o.created_at if hasattr(o, 'created_at') else None
        })
    return result

@app.get("/orders/", tags=["Quản trị - Đơn hàng"])
def list_all_orders(user_role: str = Query("user"), db: Session = Depends(get_db)):
    check_admin_role(user_role) 
    return db.query(models.Order).all()