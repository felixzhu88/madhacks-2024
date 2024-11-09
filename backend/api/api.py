from fastapi import FastAPI
from pydantic import BaseModel
import pyodbc
import pandas as pd

app = FastAPI()

db = TicketDB()

@app.get("/tickets")
async def get_tickets():
    query = "SELECT * FROM TestTable"
    df = db.load_query_pd(query)
    # Convert the dataframe to a list of dictionaries to send as JSON
    return df.to_dict(orient="records")

@app.on_event("shutdown")
def shutdown():
    db.close_connection()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
