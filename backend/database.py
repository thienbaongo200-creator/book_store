from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# ĐÃ SỬA: 
# root: Tên người dùng mặc định của MySQL
# admin: Mật khẩu (khớp với MYSQL_ROOT_PASSWORD trong docker-compose)
# db: Tên service của database trong mạng lưới Docker
# bookstore_db: Tên database bạn đã chọn
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:admin@db/bookstore_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()