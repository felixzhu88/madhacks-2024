import pyodbc
import pandas as pd

class TicketDB:
    def __init__(self):
        self.conn = None
        self.cursor = None
        self.table_ids = {}

        # Define connection parameters
        server = 'localhost,1433'   # Docker container is exposed on localhost:1433
        database = 'master'         # Change to your database name
        username = 'sa'
        password = 'YourPassword123'  # Replace with the password you set in Docker

        # Set up the connection string
        connection_string = f'DRIVER={{ODBC Driver 18 for SQL Server}};SERVER={server};DATABASE={database};UID={username};PWD={password};TrustServerCertificate=yes'

        self.establish_connection(connection_string)

    def establish_connection(self, connection_string):
        # Connect to the SQL Server
        try:
            self.conn = pyodbc.connect(connection_string)
            print("Connection successful")

            # Create a cursor object using the connection
            self.cursor = self.conn.cursor()

        except Exception as e:
            print(f"Error: {e}")

    def close_connection(self):
        if 'conn' in locals():
            self.conn.close()

    def create_test_table(self):
        query = "CREATE TABLE TestTable (id INT PRIMARY KEY, name NVARCHAR(50))"
        self.table_ids["TestTable"] = 0
        self.cursor.execute(query)

    def create_ticket_table(self):
        query = "CREATE TABLE TicketTable (id INT PRIMARY KEY, description NVARCHAR(250), date DATE)"
        self.table_ids["TicketTable"] = 0
        self.cursor.execute(query)

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
            self.cursor.execute(query)
            self.table_ids[table_name] += 1
        except Exception as e:
            print(f"Error: {e}")

    def load_query_pd(self, query, show=False):
        self.cursor.execute(query)
        # Fetch and print all results
        if show:
            for row in self.cursor.fetchall():
                print(row)

        return pd.read_sql(query, self.conn)

test = TicketDB()

test.create_ticket_table()
test.insert_tuple({"description": "Lilian going to sleep early", "date": "2024-11-9"}, "TicketTable")
test.insert_tuple({"description": "Felix is on a mac", "date": "2024-11-10"}, "TicketTable")
query = """SELECT * FROM TicketTable"""
df = test.load_query_pd(query, True)
print(df)

test.close_connection()