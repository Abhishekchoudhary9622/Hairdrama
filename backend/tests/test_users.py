def test_get_user_profile(client, creator_headers):
    res = client.get("/api/users/me", headers=creator_headers)
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert data["data"]["name"] == "Abhishek Verma"

def test_update_user_profile(client, creator_headers):
    res = client.patch(
        "/api/users/me",
        headers=creator_headers,
        json={"name": "Abhishek Verma Updated"}
    )
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert data["data"]["name"] == "Abhishek Verma Updated"

def test_list_all_users(client, creator_headers):
    res = client.get("/api/users", headers=creator_headers)
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert len(data["data"]) >= 3

def test_search_users(client, creator_headers):
    res = client.get("/api/users/search?q=rahul", headers=creator_headers)
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert len(data["data"]) == 1
    assert data["data"][0]["name"] == "Rahul Sharma"
