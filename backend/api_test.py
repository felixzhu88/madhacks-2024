import requests

base_url = "http://127.0.0.1:8000"
ticket1 = {"name": "Aaron", "email": "ayuan1114@gmail.com", "desc": "Lilian login to sleep early", "date": "2024-11-9"}
ticket2 = {"name": "Aaron", "email": "ayuan1114@gmail.com", "desc": "Felix is on a pay", "date": "2024-11-10"}
ticket3 = {"name": "Jacob", "email": "jacobyhung@gmail.com", "desc": "Felix is on a why", "date": "2024-11-10"}
filter = {"col": "email", "target": "ayuan1114@gmail.com"}

response = requests.get(base_url + "/categories")
print(response.content)

"""
response = requests.post(base_url + "/add-ticket", json=ticket1)
print(response.content)
response = requests.post(base_url + "/add-ticket", json=ticket2)
print(response.content)
response = requests.post(base_url + "/add-ticket", json=ticket3)
print(response.content)
response = requests.get(base_url + "/tickets")
print(response.content)
response = requests.post(base_url + "/filter-tickets", json=filter)
print(response.content)
response = requests.post(base_url + "/delete-ticket", json={"id": 0})
response = requests.get(base_url + "/tickets")
print(response.content)
"""