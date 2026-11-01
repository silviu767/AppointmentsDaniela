"""drop_email_or_phone_required_constraint

Revision ID: 6c214b3d491b
Revises: 52b3c92fa67e
Create Date: 2026-11-01 14:36:57.113909

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6c214b3d491b'
down_revision: Union[str, Sequence[str], None] = '52b3c92fa67e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_constraint("email_or_phone_required", "users", type_="check")
    


def downgrade() -> None:
    """Downgrade schema."""
    op.create_check_constraint(
    "email_or_phone_required",
    "users",
    "email IS NOT NULL OR phone IS NOT NULL"
)
    
