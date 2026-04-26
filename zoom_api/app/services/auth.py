from ..auth import create_access_token
from ..models import User
from ..schemas import AuthResponse, UserOut


def auth_payload(user: User) -> AuthResponse:
    return AuthResponse(access_token=create_access_token(user), user=UserOut.model_validate(user))
