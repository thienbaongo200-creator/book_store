from pydantic import BaseModel
from typing import Optional, List

# --- Cấu trúc dữ liệu Danh mục ---
class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    
    class Config:
        from_attributes = True 
        
# --- Cấu trúc dữ liệu Sách ---
class BookBase(BaseModel):
    title: str
    author: str
    price: int  
    stock: int
    category_id: int
    image_url: Optional[str] = None

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    price: Optional[int] = None 
    stock: Optional[int] = None
    category_id: Optional[int] = None
    image_url: Optional[str] = None

class BookResponse(BookBase):
    id: int
    
    class Config:
        from_attributes = True

# --- Cấu trúc dữ liệu Người dùng ---
class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    
    class Config:
        from_attributes = True

# --- Cấu trúc dữ liệu Giỏ hàng ---
# ĐÃ THÊM: Lớp này để nhận dữ liệu từ Frontend gửi lên
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

    class Config:
        from_attributes = True
        
# --- Cấu trúc dữ liệu Đơn hàng ---
class OrderResponse(BaseModel):
    id: int
    total_price: int
    status: str
    user_id: int
    class Config:
        from_attributes = True
class WishlistCreate(BaseModel):
    book_id: int
    user_id: int