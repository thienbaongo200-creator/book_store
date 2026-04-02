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
        from_attributes = True # Giúp Pydantic hiểu dữ liệu từ SQLAlchemy ORM
        
# --- Cấu trúc dữ liệu Sách ---
class BookBase(BaseModel):
    title: str
    author: str
    price: int  # ĐÃ SỬA: Đổi từ float sang int để khớp với models.py
    stock: int
    category_id: int
    image_url: Optional[str] = None

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    price: Optional[int] = None # ĐÃ SỬA: Đổi sang int
    stock: Optional[int] = None
    category_id: Optional[int] = None
    image_url: Optional[str] = None

class BookResponse(BookBase):
    id: int
    
    class Config:
        from_attributes = True

# --- Cấu trúc dữ liệu Người dùng (Dành cho chức năng Admin/User) ---
class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    
    class Config:
        from_attributes = True