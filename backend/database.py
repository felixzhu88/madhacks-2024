import pyodbc
import pandas as pd
from threading import Lock

class TicketDB:
    def __init__(self):
        self.table_ids = {}
        self.conn_lock = Lock()

        # Define connection parameters
        server = 'localhost,1433'   # Docker container is exposed on localhost:1433
        database = 'master'         # Change to your database name
        username = 'sa'
        password = 'YourPassword123'  # Replace with the password you set in Docker

        # Set up the connection string
        connection_string = f'DRIVER={{ODBC Driver 18 for SQL Server}};SERVER={server};DATABASE={database};UID={username};PWD={password};TrustServerCertificate=yes;MARS_Connection=yes'
        self.conn = self.establish_connection(connection_string)


    def establish_connection(self, connection_string):
        
        # Connect to the SQL Server
        try:
            conn = pyodbc.connect(connection_string)
            print("Successfully connected to database")
            return conn

        except Exception as e:
            print(f"Error: {e}")

    def create_test_table(self):
        query = "CREATE TABLE TestTable (id INT PRIMARY KEY, name NVARCHAR(50))"
        with self.conn_lock:
            cursor = self.conn.cursor()
            cursor.execute(query)
        self.table_ids["TestTable"] = 0

    def create_ticket_table(self):
        query = "CREATE TABLE TicketTable (id INT PRIMARY KEY, email NVARCHAR(50), name NVARCHAR(50), description NVARCHAR(250), date DATE)"
        with self.conn_lock:
            cursor = self.conn.cursor()
            
            cursor.execute(query)
        self.table_ids["TicketTable"] = 0

    def insert_tuple(self, tup, table_name="TestTable"):
        try:
            
            tuple_str = ""
            key_str = "id"
            for key, val in tup.items():
                if type(val) is str:
                    tuple_str += f"'{val}'" + ", "
                else:
                    tuple_str += str(val) + ", "
                key_str += ", " + key
            query = f"INSERT INTO {table_name} ({key_str}) VALUES ({self.table_ids[table_name]}, {tuple_str[:-2]})"
            with self.conn_lock:
                cursor = self.conn.cursor()
                cursor.execute(query)
            tup["id"] = self.table_ids[table_name]
            self.table_ids[table_name] += 1
            return tup
        except Exception as e:
            print(f"Error: {e}")
            return -1

    def load_all_pd(self, show=False):
        with self.conn_lock:
            cursor = self.conn.cursor()
            cursor.execute("SELECT * FROM TicketTable")
            # Fetch and print all results
            if show:
                for row in cursor.fetchall():
                    print(row)

            df = pd.read_sql("SELECT * FROM TicketTable", self.conn)
        return df

    def load_query_pd(self, col, target, table_name="TestTable", show=False):
        with self.conn_lock:
            cursor = self.conn.cursor()
            query = ""
            if type(target) is str:
                query = f"SELECT * FROM {table_name} t WHERE t.{col}='{target}'"
            else:
                query = f"SELECT * FROM {table_name} t WHERE t.{col}={target}"
            print(query)
            cursor.execute(query)
            # Fetch and print all results
            if show:
                for row in cursor.fetchall():
                    print(row)

            df = pd.read_sql(query, self.conn)
        return df

    def close_connection(self):
        if 'conn' in locals():
            self.conn.close()

"""
test = TicketDB()
test.create_ticket_table()
test.insert_tuple({"name": "Aaron", "email": "ayuan1114@gmail.com", "description": "Lilian going to sleep early", "date": "2024-11-9"}, "TicketTable")
test.insert_tuple({"name": "Aaron", "email": "ayuan1114@gmail.com", "description": "Felix is on a mac", "date": "2024-11-10"}, "TicketTable")
test.insert_tuple({"name": "Jacob", "email": "jacobyhung@gmail.com", "description": "Felix is on a mac", "date": "2024-11-10"}, "TicketTable")
df = test.load_query_pd("email", "ayuan1114@gmail.com", "TicketTable", True)
df = test.load_all_pd(True)
print(df)

test.close_connection()
"""