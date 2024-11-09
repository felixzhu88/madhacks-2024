from fastapi import FastAPI, Response, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pandas as pd
from database import TicketDB
from threading import Lock

class Ticket(BaseModel):
    name: str | None = None
    email: str | None = None
    desc: str | None = None
    date: str | None = None

app = FastAPI()
db = TicketDB()
mutex = Lock()

db.create_ticket_table()

@app.get("/", status_code=200)
def hi():
    return JSONResponse(content = {"hello": "world"})

@app.get("/tickets", status_code=200)
async def get_tickets():
    query = "SELECT * FROM TicketTable"
    df = db.load_query_pd(query)
    return df.to_dict()

@app.post("/add-ticket", status_code=200)
async def add_ticket(ticket: Ticket, response: Response):
    ticket_dict = {}
    ticket_dict["name"] = ticket.name
    ticket_dict["email"] = ticket.email
    ticket_dict["description"] = ticket.desc
    ticket_dict["date"] = ticket.date
    ret_ticket = db.insert_tuple(ticket_dict, "TicketTable")
    if ret_ticket == -1:
        response.status_code = 400
        return
    return JSONResponse(content = ret_ticket)


@app.on_event("shutdown")
def shutdown():
    db.close_connection()