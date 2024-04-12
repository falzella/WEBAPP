import requests

# Funzione per la registrazione
def login():
    username = "utente1"
    password = "password1"


    data = {
        "username": username,
        "password": password,
    }

    response = requests.post("http://localhost:3000/login", json=data)

    if response.status_code == 200:
        print("login effettuato con successo!")
        print(str(response.json()))
        # Ottieni il token dalla risposta
    else:
        print("Errore durante l'accesso")
        print(response.status_code)
        print(response.text)


login()