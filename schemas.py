from pydantic import BaseModel
from typing import Optional

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
    class Config:
        from_attributes = True