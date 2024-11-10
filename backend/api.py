from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pandas as pd
from database import TicketDB
from threading import Lock
from classifier import TicketClassifier

class Ticket(BaseModel):
    name: str | None = None
    email: str | None = None
    desc: str | None = None
    date: str | None = None
    
class Profile(BaseModel):
    email: str
    name: str

class Filter(BaseModel):
    col: str
    target: str

class DeletePayload(BaseModel):
    id: int

categories = ["Tech Support", "Finanace/Billing", "General"]

app = FastAPI()
db = TicketDB()
mutex = Lock()
tick_class = TicketClassifier(categories)

app.router.redirect_slashes = False

# Specify the origins that are allowed to access the API
origins = [
    "http://localhost:3000",       # Example frontend app
]

# Add CORS middleware with allowed origins, methods, and headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # Allow specific origins
    allow_credentials=True,         # Allow cookies/auth headers
    allow_methods=["*"],            # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],            # Allow all headers
)

db.create_ticket_table()

# endpoint to get categories
@app.get("/categories", status_code=200)
async def get_category():
    return categories

# endpoint to create profiles
@app.post("/create-profile", status_code=200)
async def create_profile(profile: Profile, response: Response):
    # check if profile exists
    query = f"SELECT * FROM TicketTable WHERE email = '{profile.email}' LIMIT 1"
    existing_profile = db.load_all_pd(query)
    if existing_profile.empty:
        response.status_code = 404
        return {"message": "Profile not found."}
    
    # if profile doesn't exist, create it
    return JSONResponse(content={"email": profile.email, "name": profile.name})

# endpoint to retrieve profile info
@app.get("/profile/{email}", status_code=200)
async def get_profile_details(email: str, response: Response):
    # get profile info
    query = f"SELECT * FROM TicketTable WHERE email = '{email}'"
    tickets_df = db.load_query_pd(query)
    if tickets_df.empty:
        response.status_code = 404
        return {"message": "Profile not found or no tickets submitted"}

    # convert ticket details to a list of dictionaries
    tickets = tickets_df.to_dict(orient="records")
    
    # return profile with info
    return {
        "email": email,
        "tickets": tickets
    }

@app.get("/tickets", status_code=200)
async def get_tickets():
    query = "SELECT * FROM TicketTable"
    df = db.load_all_pd(query)
    return df.to_dict('records')

@app.post("/add-ticket", status_code=200)
async def add_ticket(ticket: Ticket, response: Response):
    # filter the ticket based on the keywords in description
    category = tick_class.categorize(ticket.desc)
    ticket_dict = {
        "name": ticket.name,
        "email": ticket.email,
        "description": ticket.desc,
        "date": ticket.date,
        "category": category,
    }
    print(ticket_dict)
    ret_ticket = db.insert_tuple(ticket_dict, "TicketTable")
    if ret_ticket == -1:
        response.status_code = 400
        return {"message": "Error inserting entry"}
    return JSONResponse(content = ret_ticket)

@app.post("/filter-tickets", status_code=200)
async def filter_tickets(filter: Filter, response: Response):
    df = db.load_query_pd(filter.col, filter.target, "TicketTable")
    return df.to_dict('records')

@app.post("/delete-ticket", status_code=200)
async def delete_ticket(id: DeletePayload, response: Response):
    db.delete_row(id.id, "TicketTable")

@app.on_event("shutdown")
def shutdown():
    db.close_connection()