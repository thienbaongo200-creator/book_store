from fastapi import FastAPI
import models
from database import engine

# Lệnh này cực kỳ quan trọng: Nó tự tạo bảng 'books' trong MySQL cho bạn
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Chào Bảo! Backend đã kết nối MySQL thành công."}