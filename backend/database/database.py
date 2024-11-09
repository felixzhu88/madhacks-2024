import pyodbc
import pandas as pd

class TicketDB:
    def __init__(self):
        self.conn = None
        self.cursor = None

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

    def create_table(self):
        query = "CREATE TABLE TestTable (id INT PRIMARY KEY, name NVARCHAR(50))"
        self.cursor.execute(query)

    def insert_tuple(self, id, name, table_name="TestTable"):
        try:
            query = f"INSERT INTO {table_name} (id, name) VALUES ({id}, '{name}')"
            self.cursor.execute(query)
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

test.create_table()
test.insert_tuple(1, "Aaron")
test.insert_tuple(2, "Felix")
test.insert_tuple(3, "Allyssa")
test.insert_tuple(4, "Jacob")
test.insert_tuple(5, "Lilian")
query = """SELECT * FROM TestTable t
            WHERE t.id < 3;
        """
df = test.load_query_pd(query, True)
print(df)

test.close_connection()