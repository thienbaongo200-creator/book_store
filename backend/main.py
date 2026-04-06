import os
from fastapi import FastAPI, Depends, HTTPException, Query, File, UploadFile, Form
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session, joinedload
from fastapi import Header
import shutil
# Import từ các file local của Team
from . import models, schemas
from .database import SessionLocal, engine

# Tự động tạo bảng trong Database (MySQL/SQLite)
models.Base.metadata.create_all(bind=engine)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "static", "images")
app = FastAPI(
    title="Hệ thống Quản lý Nhà sách - Team Bảo",
    description="API quản lý sách tích hợp phân quyền và bảo mật người dùng",
    version="1.6.0"
)
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")
# 1. Cấu hình CORS - Giúp React kết nối được với FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Cấu hình Static Files (Lưu ảnh sách)
current_dir = os.path.dirname(os.path.realpath(__file__))
static_path = os.path.join(current_dir, "static")
os.makedirs(os.path.join(static_path, "images"), exist_ok=True)

# Dependency: Kết nối Database cho mỗi Request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Hàm kiểm tra phân quyền Admin
def check_admin_role(user_role: str):
    if user_role != "admin":
        raise HTTPException(
            status_code=403, 
            detail="Bạn không có quyền Quản trị viên!"
        )

# --- 1. HỆ THỐNG & TÀI KHOẢN ---

@app.get("/", tags=["Hệ thống"])
def read_root():
    return {"message": "Backend Nhà sách Team Bảo đang hoạt động!", "status": "Online"}

@app.post("/login", tags=["Tài khoản"])
def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == user_data.username).first()
    if not user or user.password != user_data.password:
        raise HTTPException(status_code=400, detail="Sai tài khoản hoặc mật khẩu")
    
    # Trả về để Frontend lưu vào LocalStorage
    return {
        "id": user.id,
        "username": user.username,
        "role": user.role,
        "name": user.username
    }
@app.post("/users/", response_model=schemas.UserResponse, tags=["Tài khoản"])
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Tên đăng nhập đã tồn tại!")
    
    new_user = models.User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
# --- 2. QUẢN LÝ DANH MỤC & SÁCH ---

@app.get("/categories/", response_model=List[schemas.CategoryResponse], tags=["Danh mục"])
def list_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

@app.get("/books/{book_id}", response_model=schemas.BookResponse, tags=["Sách"])
def read_book(book_id: int, db: Session = Depends(get_db)):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách!")
    return db_book

@app.post("/books/")
async def create_book(
    title: str = Form(...),
    author: str = Form(...),
    price: int = Form(...),
    stock: int = Form(...),
    description: str = Form(""),
    category_id: int = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    x_user_role: str = Header(None)
):
    # Kiểm tra quyền admin của Bảo ở đây...

    # Đảm bảo thư mục tồn tại
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Lưu file vào backend/static/images/
    file_path = os.path.join(UPLOAD_DIR, image.filename)
    with open(file_path, "wb+") as buffer:
        shutil.copyfileobj(image.file, buffer)

    # Lưu vào database đường dẫn để Frontend truy cập
    # Vì mình sẽ mount thư mục static này, nên chỉ cần lưu: /static/images/ten_file.jpg
    db_image_url = f"/static/images/{image.filename}"
    
    new_book = models.Book(
        title=title,
        author=author,
        price=price,
        stock=stock,
        description=description,
        category_id=category_id,
        image_url=db_image_url
    )
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book

# --- QUAN TRỌNG: THÊM ROUTE SỬA SÁCH (FIX LỖI 405) ---
@app.put("/books/{book_id}", tags=["Quản trị - Sách"])
async def update_book(
    book_id: int,
    title: str = Form(...),
    author: str = Form(...),
    price: int = Form(...),
    stock: int = Form(...),
    description: str = Form(""),
    category_id: int = Form(...),
    image: Optional[UploadFile] = File(None), # Ảnh là tùy chọn khi sửa
    db: Session = Depends(get_db),
    x_user_role: str = Header(None)
):
    check_admin_role(x_user_role)
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Sách không tồn tại")

    # Nếu có upload ảnh mới
    if image:
        file_path = os.path.join(UPLOAD_DIR, image.filename)
        with open(file_path, "wb+") as buffer:
            shutil.copyfileobj(image.file, buffer)
        db_book.image_url = f"/static/images/{image.filename}"

    db_book.title = title
    db_book.author = author
    db_book.price = price
    db_book.stock = stock
    db_book.description = description
    db_book.category_id = category_id

    db.commit()
    return db_book

# --- ROUTE XÓA SÁCH ---
@app.delete("/books/{book_id}", tags=["Quản trị - Sách"])
def delete_book(book_id: int, x_user_role: Optional[str] = Header(None), db: Session = Depends(get_db)):
    check_admin_role(x_user_role) # Bảo nên thêm kiểm tra quyền ở đây cho an toàn
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách")
    db.delete(db_book)
    db.commit()
    return {"message": "Xóa thành công"}
@app.get("/books/", tags=["Sách"])
def get_books(page: int = 1, limit: int = 20, search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Book)
    if search:
        # icontains giúp tìm kiếm không phân biệt hoa thường
        query = query.filter(models.Book.title.icontains(search))
        
    total_count = query.count()
    offset = (page - 1) * limit
    books = query.offset(offset).limit(limit).all()
    
    import math
    return {
        "books": books,
        "total_pages": math.ceil(total_count / limit) if limit > 0 else 1,
        "current_page": page,
        "total_items": total_count
    }
# --- 3. QUẢN LÝ GIỎ HÀNG ---

@app.get("/cart/{user_id}", response_model=List[schemas.CartItemResponse], tags=["Giỏ hàng"])
def get_user_cart(user_id: int, db: Session = Depends(get_db)):
    # Bổ sung joinedload để lấy luôn thông tin sách đi kèm
    return db.query(models.CartItem).options(
        joinedload(models.CartItem.book)
    ).filter(models.CartItem.user_id == user_id).all()

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

@app.delete("/cart/{item_id}", tags=["Giỏ hàng"])
def delete_cart_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.CartItem).filter(models.CartItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Mục không tồn tại!")
    db.delete(db_item)
    db.commit()
    return {"message": "Đã xóa khỏi giỏ hàng"}

# --- 4. QUẢN LÝ YÊU THÍCH (WISHLIST) ---

@app.get("/wishlist/{user_id}", tags=["Yêu thích"])
def get_user_wishlist(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Wishlist).filter(models.Wishlist.user_id == user_id).options(
        joinedload(models.Wishlist.book)
    ).all()

@app.post("/wishlist/toggle", tags=["Yêu thích"])
def toggle_wishlist(item: schemas.WishlistCreate, db: Session = Depends(get_db)):
    exists = db.query(models.Wishlist).filter(
        models.Wishlist.book_id == item.book_id, 
        models.Wishlist.user_id == item.user_id
    ).first()

    if exists:
        db.delete(exists)
        db.commit()
        return {"status": False, "message": "Đã bỏ yêu thích"}
    
    db_item = models.Wishlist(**item.model_dump())
    db.add(db_item)
    db.commit()
    return {"status": True, "message": "Đã thêm vào yêu thích"}

# --- 5. QUẢN LÝ ĐƠN HÀNG (ORDERS) ---

@app.post("/orders/{user_id}", tags=["Đơn hàng"])
def create_order(user_id: int, db: Session = Depends(get_db)):
    # 1. Lấy giỏ hàng kèm thông tin sách
    cart_items = db.query(models.CartItem).options(
        joinedload(models.CartItem.book)
    ).filter(models.CartItem.user_id == user_id).all()

    if not cart_items:
        raise HTTPException(status_code=400, detail="Giỏ hàng trống!")

    try:
        # 2. Tính tổng tiền
        total = sum(item.book.price * item.quantity for item in cart_items)

        # 3. Tạo đơn hàng (Order)
        new_order = models.Order(user_id=user_id, total_price=total, status="Success")
        db.add(new_order)
        db.flush() 
        for item in cart_items:
            order_item = models.OrderItem(
                order_id=new_order.id,
                book_id=item.book_id,
                quantity=item.quantity,
                price_at_purchase=item.book.price 
            )
            db.add(order_item)
        db.query(models.CartItem).filter(models.CartItem.user_id == user_id).delete()

        db.commit()
        db.refresh(new_order)
        return {"message": "Thanh toán thành công!", "order_id": new_order.id, "total": new_order.total_price}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/orders/{user_id}", response_model=List[schemas.OrderResponse], tags=["Đơn hàng"])
def get_user_order_history(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Order).options(
        joinedload(models.Order.items).joinedload(models.OrderItem.book)
    ).filter(models.Order.user_id == user_id).order_by(models.Order.id.desc()).all()
@app.get("/orders/detail/{order_id}", tags=["Đơn hàng"])
def get_order_detail(order_id: int, db: Session = Depends(get_db)):
    # Lấy thông tin đơn hàng
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")
    
    # Ở đây nếu Bảo có bảng OrderItem (lưu lịch sử sách đã mua), hãy join vào.
    # Nếu chưa có bảng OrderItem, tạm thời trả về thông tin cơ bản.
    return {
        "id": order.id,
        "total": order.total_price,
        "status": order.status,
        "created_at": order.created_at,
        # Giả sử Bảo muốn hiển thị lời nhắn hoặc thông tin thêm
        "note": "Cảm ơn bạn đã mua sắm!" 
    }
# --- 6. QUẢN TRỊ (ADMIN) ---

@app.get("/admin/orders/", tags=["Quản trị - Đơn hàng"])
def list_all_orders_admin(user_role: str = Query("user"), db: Session = Depends(get_db)):
    check_admin_role(user_role)
    return db.query(models.Order).all()