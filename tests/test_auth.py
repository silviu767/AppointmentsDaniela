def test_register_and_login(client):
     reg_res = client.post("/api/users/register", json={"email": "test.automat@gmail.com",
                                                        "password": "silviu342",
                                                        "first_name": "Silviu",
                                                        "last_name": "Tataru"})
     assert reg_res.status_code == 201

     login_res = client.post("/api/users/login", json={"email": "test.automat@gmail.com",
                                                       "password": "silviu342"})

     assert "access_token" in login_res.json()

def test_login_wrong_password_returns_401(client):
     login_re = client.post("/api/users/login", json={"email": "test.automat@gmail.com",
                                                       "password": "silviu342"})

     assert login_re.status_code == 401