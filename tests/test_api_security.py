from fastapi.testclient import TestClient
from backend.main import app
from types import SimpleNamespace
from backend.services.users import get_current_user


client = TestClient(app)

def test_admin_routes_require_authentication():
    response = client.get("/api/admin/appointments")

    assert response.status_code == 401

def test_admin_route_rejects_fake_token():
    response = client.get("/api/admin/appointments", headers = {"Authorization":"Bearer token-fals-de-hacker"})

    assert response.status_code == 401

def test_registru_rejects_invalid_email():
    response = client.post("/api/users/register", json={"email": "email-de-test", "password": "parola-de-test", "first_name": "Ana", "last_name": "Maria"})

    assert response.status_code == 422

def test_client_cannot_access_admin_routes():
    def fake_client():
        return SimpleNamespace(user_id=1, role="client", is_active=True)

    app.dependency_overrides[get_current_user] = fake_client
   
    try:
        response = client.get("/api/admin/appointments")
        assert response.status_code == 403
    finally:
        app.dependency_overrides.clear()
    