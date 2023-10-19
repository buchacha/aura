from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
import re
UserModel = get_user_model()

def custom_validation(data):
    email = data['email'].strip()
    password = data['password'].strip()

    regex_email = re.compile(r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+')

    if not re.fullmatch(regex_email, email):
        raise ValidationError('Почта введена некорректно')

    if not email or UserModel.objects.filter(email=email).exists():
        raise ValidationError('Такая почта уже существует')

    if not password or len(password) < 8:
        raise ValidationError('Слишком короткий пароль. Минимум 8 символов')

    return data


def validate_email(data):
    email = data['email'].strip()
    if not email:
        raise ValidationError('Не правильная почта')
    return True


def validate_password(data):
    password = data['password'].strip()
    if not password:
        raise ValidationError('Не правильный пароль')
    return True