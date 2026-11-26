from datetime import datetime , timedelta
from zoneinfo import ZoneInfo
from backend.services.slots import is_slot_available
from types import SimpleNamespace


TZ = ZoneInfo("Europe/Paris")

def test_slot_too_soon_is_rejected():

    now = datetime(2026, 11, 26, 10, 0, tzinfo=TZ)
    slot_start = datetime(2026, 11, 26, 11, 0, tzinfo=TZ)

    busy_until = slot_start + timedelta(minutes=70)

    available = is_slot_available(
        slot_start=slot_start,
        busy_until=busy_until,
        blocked_periods=[],
        appointments=[],
        now=now,
    )

    assert available is False


def test_slot_far_enough_is_available():

    now = datetime(2026, 11, 26, 10, 0, tzinfo=TZ)
    slot_start = datetime(2026, 11, 26, 14, 0, tzinfo=TZ)
    busy_until = slot_start + timedelta(minutes=70)

    available = is_slot_available(
        slot_start=slot_start,
        busy_until=busy_until,
        blocked_periods=[],
        appointments=[],
        now=now,
    )

    assert available is True 


def test_slot_in_buffer_is_rejected():
    now = datetime(2026, 11, 26, 10, 0, tzinfo=TZ)
    #DuckTyping
    fake_app = SimpleNamespace(
    starts_at = datetime(2026, 11, 26, 14, 0, tzinfo=TZ),
    ends_at = datetime(2026, 11, 26, 15, 0, tzinfo=TZ),
    )
    slot_start = datetime(2026, 11, 26, 15, 5, tzinfo=TZ)
    busy_until = slot_start + timedelta(minutes=70)
    
    available = is_slot_available(
        slot_start=slot_start,
        busy_until=busy_until,
        blocked_periods=[],
        appointments=[fake_app],
        now=now,
    )
    assert available is False

def test_slot_after_buffer_is_available():
    now = datetime(2026, 11, 26, 10, 0, tzinfo=TZ)
    fake_app = SimpleNamespace(
        starts_at = datetime(2026, 11, 26, 14, 0, tzinfo=TZ),
        ends_at = datetime(2026, 11, 26, 15, 0, tzinfo=TZ),
        )
    slot_start = datetime(2026, 11, 26, 15, 10, tzinfo=TZ)
    busy_until = slot_start + timedelta(minutes=70)

    available = is_slot_available(
        slot_start=slot_start,
        busy_until=busy_until,
        blocked_periods=[],
        appointments=[fake_app],
        now=now,
    )

    assert available is True

def test_is_slot_blocked_by_admin():
    now = datetime(2026, 11, 26, 14, 0, tzinfo=TZ)
    fake_period = SimpleNamespace(
        starts_at = datetime(2026, 11, 27, 10, 0, tzinfo=TZ),
        ends_at = datetime(2026, 11, 27, 15, 0, tzinfo=TZ ),
    )
    slot_start = datetime(2026, 11, 27, 12, 0, tzinfo=TZ)
    busy_until = slot_start + timedelta(minutes=70)

    available = is_slot_available(
        slot_start=slot_start,
        busy_until=busy_until,
        blocked_periods=[fake_period],
        appointments=[],
        now=now,

    )

    assert available is False