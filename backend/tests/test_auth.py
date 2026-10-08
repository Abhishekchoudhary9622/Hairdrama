def test_dev_login_success(client):
    res = client.post("/api/auth/dev-login", json={"email": "abhishek@hairdrama.tech"})
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert "token" in data["data"]
    assert data["data"]["user"]["email"] == "abhishek@hairdrama.tech"

def test_get_current_user_authenticated(client, creator_headers):
    res = client.get("/api/auth/me", headers=creator_headers)
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert data["data"]["email"] == "abhishek@hairdrama.tech"

def test_get_current_user_unauthorized(client):
    res = client.get("/api/auth/me")
    assert res.status_code == 401
    data = res.get_json()
    assert data["success"] is False
    assert data["error"]["code"] == "UNAUTHORIZED"

def test_google_auth_endpoint(client):
    res = client.get("/api/auth/google")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert "auth_url" in data["data"]
    assert "accounts.google.com" in data["data"]["auth_url"]

def test_logout(client):
    res = client.post("/api/auth/logout")
    assert res.status_code == 200
    assert res.get_json()["success"] is True
