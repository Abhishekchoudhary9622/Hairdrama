def test_notification_flow(client, creator_headers, assignee_headers, assignee_user):
    # 1. Creator creates task -> Assignee receives notification
    res_task = client.post("/api/tasks", headers=creator_headers, json={
        "title": "Fix notification badge",
        "assigned_to": assignee_user["id"]
    })
    task_id = res_task.get_json()["data"]["id"]

    # 2. Check assignee notifications
    res_notifs = client.get("/api/notifications", headers=assignee_headers)
    assert res_notifs.status_code == 200
    data = res_notifs.get_json()["data"]
    assert data["unread_count"] >= 1
    assert any(n["task_id"] == task_id for n in data["notifications"])

    notif_id = data["notifications"][0]["id"]

    # 3. Mark single notification as read
    res_read = client.patch(f"/api/notifications/{notif_id}/read", headers=assignee_headers)
    assert res_read.status_code == 200
    assert res_read.get_json()["data"]["is_read"] is True

    # 4. Mark all as read
    res_all = client.patch("/api/notifications/read-all", headers=assignee_headers)
    assert res_all.status_code == 200

    # 5. Verify unread count is 0
    res_after = client.get("/api/notifications", headers=assignee_headers)
    assert res_after.get_json()["data"]["unread_count"] == 0

    # 6. Verify invalid/clamped limit query params handle gracefully
    res_invalid_limit = client.get("/api/notifications?limit=invalid", headers=assignee_headers)
    assert res_invalid_limit.status_code == 200
    res_large_limit = client.get("/api/notifications?limit=9999", headers=assignee_headers)
    assert res_large_limit.status_code == 200
