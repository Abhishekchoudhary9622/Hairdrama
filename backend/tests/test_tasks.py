def test_create_task_success(client, creator_headers, assignee_user):
    payload = {
        "title": "Build authentication engine",
        "description": "Implement Google OAuth 2.0 flow",
        "priority": "HIGH",
        "assigned_to": assignee_user["id"],
        "due_date": "2026-10-15T10:00:00Z"
    }
    res = client.post("/api/tasks", headers=creator_headers, json=payload)
    assert res.status_code == 201
    data = res.get_json()
    assert data["success"] is True
    assert data["data"]["title"] == "Build authentication engine"
    assert data["data"]["status"] == "TODO"
    assert data["data"]["priority"] == "HIGH"

def test_create_task_validation_failure(client, creator_headers):
    # Missing title and assignee
    res = client.post("/api/tasks", headers=creator_headers, json={})
    assert res.status_code == 400
    data = res.get_json()
    assert data["success"] is False
    assert data["error"]["code"] == "VALIDATION_ERROR"

def test_authorization_matrix(client, creator_headers, assignee_headers, other_headers, assignee_user, other_user):
    # Creator creates task
    res_create = client.post("/api/tasks", headers=creator_headers, json={
        "title": "Matrix Authorization Spec Task",
        "assigned_to": assignee_user["id"],
        "priority": "URGENT"
    })
    task_id = res_create.get_json()["data"]["id"]

    # 1. View task:
    # Creator: Allowed
    assert client.get(f"/api/tasks/{task_id}", headers=creator_headers).status_code == 200
    # Assignee: Allowed
    assert client.get(f"/api/tasks/{task_id}", headers=assignee_headers).status_code == 200
    # Other user: Denied (403)
    assert client.get(f"/api/tasks/{task_id}", headers=other_headers).status_code == 403

    # 2. Edit task details:
    # Creator: Allowed
    assert client.patch(f"/api/tasks/{task_id}", headers=creator_headers, json={"title": "Updated Title"}).status_code == 200
    # Assignee: Denied (403)
    assert client.patch(f"/api/tasks/{task_id}", headers=assignee_headers, json={"title": "Assignee Edit"}).status_code == 403
    # Other user: Denied (403)
    assert client.patch(f"/api/tasks/{task_id}", headers=other_headers, json={"title": "Other Edit"}).status_code == 403

    # 3. Change status:
    # Assignee: Allowed
    res_status = client.patch(f"/api/tasks/{task_id}/status", headers=assignee_headers, json={"status": "IN_PROGRESS"})
    assert res_status.status_code == 200
    # Other user: Denied (403)
    assert client.patch(f"/api/tasks/{task_id}/status", headers=other_headers, json={"status": "COMPLETED"}).status_code == 403

    # 4. Assign task:
    # Assignee: Denied (403 - creator only)
    assert client.patch(f"/api/tasks/{task_id}/assign", headers=assignee_headers, json={"assigned_to": other_user["id"]}).status_code == 403
    # Creator: Allowed
    assert client.patch(f"/api/tasks/{task_id}/assign", headers=creator_headers, json={"assigned_to": other_user["id"]}).status_code == 200

    # 5. Delete task:
    # Assignee: Denied (403)
    assert client.delete(f"/api/tasks/{task_id}", headers=assignee_headers).status_code == 403
    # Creator: Allowed
    assert client.delete(f"/api/tasks/{task_id}", headers=creator_headers).status_code == 200

def test_task_state_machine_transitions(client, creator_headers, assignee_user):
    res_create = client.post("/api/tasks", headers=creator_headers, json={
        "title": "State machine validation task",
        "assigned_to": assignee_user["id"]
    })
    task_id = res_create.get_json()["data"]["id"]

    # TODO -> IN_PROGRESS: Valid
    res1 = client.patch(f"/api/tasks/{task_id}/status", headers=creator_headers, json={"status": "IN_PROGRESS"})
    assert res1.status_code == 200
    assert res1.get_json()["data"]["status"] == "IN_PROGRESS"

    # IN_PROGRESS -> COMPLETED: Valid
    res2 = client.patch(f"/api/tasks/{task_id}/status", headers=creator_headers, json={"status": "COMPLETED"})
    assert res2.status_code == 200
    assert res2.get_json()["data"]["status"] == "COMPLETED"
    assert res2.get_json()["data"]["completed_at"] is not None

    # COMPLETED -> TODO: Invalid (must reopen to IN_PROGRESS per Section 7 state machine)
    res3 = client.patch(f"/api/tasks/{task_id}/status", headers=creator_headers, json={"status": "TODO"})
    assert res3.status_code == 400
    assert "Cannot transition" in res3.get_json()["error"]["message"]

    # COMPLETED -> IN_PROGRESS: Valid reopen
    res4 = client.patch(f"/api/tasks/{task_id}/status", headers=creator_headers, json={"status": "IN_PROGRESS"})
    assert res4.status_code == 200
    assert res4.get_json()["data"]["status"] == "IN_PROGRESS"

def test_task_stats(client, creator_headers, assignee_user):
    res = client.get("/api/tasks/stats", headers=creator_headers)
    assert res.status_code == 200
    data = res.get_json()["data"]
    assert "total" in data
    assert "todo" in data
    assert "in_progress" in data
    assert "completed" in data
    assert "overdue" in data

def test_task_trailing_slash_tolerance(client, creator_headers):
    # Both /api/tasks and /api/tasks/ should resolve cleanly without 404 or redirect error
    res_no_slash = client.get("/api/tasks", headers=creator_headers)
    assert res_no_slash.status_code == 200
    res_slash = client.get("/api/tasks/", headers=creator_headers)
    assert res_slash.status_code == 200
