from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pandas as pd
from database import TicketDB
from threading import Lock

app = FastAPI()
db = TicketDB()
mutex = Lock()

db.create_ticket_table()
db.insert_tuple({"description": "Lilian going to sleep early", "date": "2024-11-9"}, "TicketTable")
db.insert_tuple({"description": "Felix is on a mac", "date": "2024-11-10"}, "TicketTable")

@app.get("/", status_code=200)
def hi():
    return JSONResponse(content = {"hello": "world"})

@app.get("/tickets", status_code=200)
async def get_tickets():
    query = "SELECT * FROM TicketTable"
    with mutex:
        df = db.load_query_pd(query)
    print(df)
    return df.to_dict()

@app.on_event("shutdown")
def shutdown():
    db.close_connection()