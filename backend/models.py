from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True)
    
    # Quan hệ: Một danh mục có nhiều sách
    books = relationship("Book", back_populates="category")

class Book(Base):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    author = Column(String(255))
    price = Column(Integer, default=0) 
    image_url = Column(String(555), nullable=True)
    stock = Column(Integer, default=0)
    category_id = Column(Integer, ForeignKey("categories.id"))
    
    # Quan hệ
    category = relationship("Category", back_populates="books")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    password = Column(String(255))
    role = Column(String(20), default="user") # "user" hoặc "admin"
    
    # Quan hệ: Một user có nhiều đơn hàng, giỏ hàng và yêu thích
    # Cascade="all, delete-orphan" giúp xóa User thì xóa sạch dữ liệu liên quan
    orders = relationship("Order", back_populates="owner", cascade="all, delete-orphan")
    cart_items = relationship("CartItem", back_populates="user", cascade="all, delete-orphan")
    wishlist_items = relationship("Wishlist", back_populates="user", cascade="all, delete-orphan")

class CartItem(Base):
    __tablename__ = "cart_items"
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    quantity = Column(Integer, default=1)
    
    # Quan hệ
    book = relationship("Book")
    user = relationship("User", back_populates="cart_items")

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    total_price = Column(Integer)
    status = Column(String(50), default="Success") 
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Thêm cột này để hiện ngày đặt hàng ở Frontend
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Quan hệ
    owner = relationship("User", back_populates="orders")

class Wishlist(Base):
    __tablename__ = "wishlist"
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    book = relationship("Book")
    user = relationship("User", back_populates="wishlist_items")