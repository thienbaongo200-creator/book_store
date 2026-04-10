from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

# --- 1. DANH MỤC (CATEGORY) ---
class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- 2. SÁCH (BOOK) ---
class BookBase(BaseModel):
    title: str
    author: str
    price: int  
    stock: int
    category_id: int
    image_url: Optional[str] = None

class BookCreate(BookBase):
    pass

class BookResponse(BookBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- 3. NGƯỜI DÙNG (USER) ---

# Dùng cho trang Đăng ký (Register)
class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "user"

# Dùng cho trang Đăng nhập (Login)
class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    model_config = ConfigDict(from_attributes=True)

# --- 4. GIỎ HÀNG (CART) ---
class CartItemCreate(BaseModel):
    book_id: int
    user_id: int  
    quantity: int = 1

class CartItemResponse(BaseModel):
    id: int
    book_id: int
    user_id: int
    quantity: int
    book: BookResponse 
    model_config = ConfigDict(from_attributes=True)

class CartUpdateQuantity(BaseModel):
    quantity: int

    class Config:
        from_attributes = True
# --- 5. ĐƠN HÀNG (ORDER) ---
class OrderItemResponse(BaseModel):
    id: int
    book_id: int
    quantity: int
    price_at_purchase: int
    book: "BookResponse" 
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    total_price: int
    status: str
    user_id: int
    created_at: datetime
    items: List[OrderItemResponse] = []
    class Config:
        from_attributes = True

# --- 6. YÊU THÍCH (WISHLIST) ---
class WishlistCreate(BaseModel):
    book_id: int
    user_id: int

class WishlistResponse(BaseModel):
    id: int
    book_id: int
    user_id: int
    book: BookResponse
    model_config = ConfigDict(from_attributes=True)