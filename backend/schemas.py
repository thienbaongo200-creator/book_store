from pydantic import BaseModel
from typing import Optional

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    class Config:
        from_attributes = True
        
# Cấu trúc dữ liệu Sách
class BookBase(BaseModel):
    title: str
    author: str
    price: float
    stock: int
    category_id: int

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    category_id: Optional[int] = None

class BookResponse(BookBase):
    id: int
    image_url: Optional[str] = None
    class Config:
        from_attributes = True
class CartItemCreate(BaseModel):
    book_id: int
    quantity: int = 1

class CartItemResponse(BaseModel):
    id: int
    book_id: int
    quantity: int
    book: BookResponse 
    class Config:
        from_attributes = True