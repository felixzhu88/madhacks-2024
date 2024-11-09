from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ItemResponse(BaseModel):
    message: str
    

@app.get("/")
def get_data():
    return{"hello": "world"}
