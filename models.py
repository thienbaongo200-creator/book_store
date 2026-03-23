from sqlalchemy import Column, Integer, String, Float
from database import Base

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    author = Column(String(255))
    price = Column(Float)
    stock = Column(Integer, default=0)