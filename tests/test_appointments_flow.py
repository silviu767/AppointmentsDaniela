from datetime import datetime, timedelta, time
from backend.models.services import Service
from backend.models.working_hours import WorkingHour
from backend.services.slots import BUSINESS_TZ

def test_create_appointment_and_prevent_double_booking(client, db_session):
    service = Service(name="test manichiura 99", duration_minutes = 60, price = 150, is_active= True)
    db_session.add(service)
    db_session.flush()

    target_date = (datetime.now(BUSINESS_TZ) + timedelta(days = 30)).date()

    db_session.query(WorkingHour).filter(WorkingHour.day_of_week == target_date.weekday()).delete()

    wh = WorkingHour(day_of_week = target_date.weekday(), 
                     starts_at = time(9, 0),
                     ends_at = time(18, 0)
                    )
    db_session.add(wh)
    db_session.flush()

    client.post("/api/users/register", json={"email": "ionut@gmail.com",
                                             "password": "ion81234543",
                                             "first_name": "IOn",
                                             "last_name": "angela"})

    login_res = client.post("/api/users/login", json={"email": "ionut@gmail.com",
                                                      "password": "ion81234543"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    slot_time = datetime.combine(target_date, time(10, 0), tzinfo=BUSINESS_TZ)
    res1 = client.post("/api/appointments", 
                       headers=headers, 
                       json={"service_id": service.service_id,
                             "starts_at": slot_time.isoformat()})
    
    assert res1.status_code == 201
    assert float(res1.json()["price_at_booking"]) == 150.0

    res2 = client.post("/api/appointments", 
                       headers=headers, 
                       json={"service_id": service.service_id,
                             "starts_at": slot_time.isoformat()})

    assert res2.status_code == 400

def test_Cancel_appointment_succeeds_over_24h(client, db_session):
    service = Service(name="test manichiura 99", duration_minutes = 60, price = 150, is_active= True)
    db_session.add(service)
    db_session.flush()
    
    target_date = (datetime.now(BUSINESS_TZ) + timedelta(days = 30)).date()
    
    db_session.query(WorkingHour).filter(WorkingHour.day_of_week == target_date.weekday()).delete()
    
    wh = WorkingHour(day_of_week = target_date.weekday(), 
                         starts_at = time(9, 0),
                         ends_at = time(18, 0)
                        )
    db_session.add(wh)
    db_session.flush()
    
    client.post("/api/users/register", json={"email": "ionut@gmail.com",
                                                 "password": "ion81234543",
                                                 "first_name": "IOn",
                                                 "last_name": "angela"})
    
    login_res = client.post("/api/users/login", json={"email": "ionut@gmail.com",
                                                          "password": "ion81234543"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    slot_time = datetime.combine(target_date, time(10, 0), tzinfo=BUSINESS_TZ)
    res1 = client.post("/api/appointments", 
                           headers=headers, 
                           json={"service_id": service.service_id,
                                 "starts_at": slot_time.isoformat()})
    
    appointment_id = res1.json()["appointment_id"]
    cancel_res = client.post(f"/api/appointments/{appointment_id}/cancel", headers=headers)

    assert cancel_res.status_code ==200
    assert cancel_res.json()["status"] == "cancelled_by_client"


def test_cannot_cancel_another_user_appointment(client, db_session):
    service = Service(name="test manichiura 99", duration_minutes = 60, price = 150, is_active= True)
    db_session.add(service)
    db_session.flush()
    
    target_date = (datetime.now(BUSINESS_TZ) + timedelta(days = 20)).date()
    
    db_session.query(WorkingHour).filter(WorkingHour.day_of_week == target_date.weekday()).delete()
    
    wh = WorkingHour(day_of_week = target_date.weekday(), 
                         starts_at = time(9, 0),
                         ends_at = time(18, 0)
                        )
    db_session.add(wh)
    db_session.flush()
    
    client.post("/api/users/register", json={"email": "ionut@gmail.com",
                                                 "password": "ion81234543",
                                                 "first_name": "IOn",
                                                 "last_name": "angela"})
    
    login_res = client.post("/api/users/login", json={"email": "ionut@gmail.com",
                                                          "password": "ion81234543"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    slot_time = datetime.combine(target_date, time(10, 0), tzinfo=BUSINESS_TZ)
    res = client.post("/api/appointments", 
                           headers=headers, 
                           json={"service_id": service.service_id,
                                 "starts_at": slot_time.isoformat()})
     
    appointment_id = res.json()["appointment_id"]
    
    
    client.post("/api/users/register", json={"email": "ionuta@gmail.com",
                                                 "password": "ion81234543",
                                                 "first_name": "IOen",
                                                 "last_name": "angela"})
    
    login_res1 = client.post("/api/users/login", json={"email": "ionuta@gmail.com",
                                                          "password": "ion81234543"})
    token = login_res1.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token}"}
    
    cancel_res = client.post(f"/api/appointments/{appointment_id}/cancel", headers=headers_b)

    assert cancel_res.status_code == 403