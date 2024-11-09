import requests

base_url = "http://127.0.0.1:8000"
ticket1 = {"name": "Aaron", "desc": "Lilian going to sleep early", "date": "2024-11-9"}
ticket2 = {"name": "Aaron", "desc": "Felix is on a mac", "date": "2024-11-10"}

response = requests.post(base_url + "/add-ticket", json=ticket1)
print(response.content)
response = requests.post(base_url + "/add-ticket", json=ticket2)
print(response.content)
response = requests.get(base_url + "/tickets")
print(response.content)