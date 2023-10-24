import os
from pathlib import Path
from datetime import timedelta


# Базовая папка проекта
BASE_DIR = Path(__file__).resolve().parent.parent

# Секретный ключ для шифрования
SECRET_KEY = "django-insecure-273c2jjigs#oi^(1%!&(_+=-rez@l%@_ca=ohvsag^kqd=sc%x"

# Режим отладки
DEBUG = True  # LOCALDEV

CORS_ALLOW_ALL_ORIGINS = False  # Запретить доступ от всех источников (False)
CORS_ALLOW_CREDENTIALS = True  # Разрешить отправку куки и заголовков аутентификации

# Добавьте домены, с которых разрешены запросы (http://localhost:3000, http://127.0.0.1:8000 и другие)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:8000",
    # Другие домены
]

ALLOWED_HOSTS = [
    "127.0.0.1",  # LOCALDEV
    "localhost",
    "127.0.0.1:3000",
    "api.aura-ai.site",
    "www.api.aura-ai.site",
    "aura-ai.site",
    "www.aura-ai.site",
]

CSRF_TRUSTED_ORIGINS = [
    'https://api.aura-ai.site',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'origin',
    'dnt',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',
    'https://aura-ai.site',
    'https://api.aura-ai.site',
    'http://aura-ai.site',
    'http://api.aura-ai.site',
]
# <- Настройки доступа

# Приложения Django
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "backend_api",
    "rest_framework",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
]

# Настройки REST Framework
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    )
}

# Настройки JWT
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=9999),
}

# Предобработка запросов
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# URL
ROOT_URLCONF = "VoiceMatch.urls"

# Шаблоны
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# WSGI
WSGI_APPLICATION = "VoiceMatch.wsgi.application"

# База данных
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'aura',
        'USER': 'default',
        'PASSWORD': 'xK0eW0rX6m',
        'HOST': 'localhost',
    }
}

# Модель пользователя
AUTH_USER_MODEL = 'backend_api.User'

# Валидации для паролей
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Настройки языка и времени ->
LANGUAGE_CODE = "ru"

TIME_ZONE = "Europe/Moscow"

USE_I18N = True

USE_TZ = True
# <- Настройки языка и времени

# Настройки путей ->
STATIC_URL = "/static/"

STATIC_ROOT = "static/"

MEDIA_ROOT = os.path.join(BASE_DIR, "media")

MEDIA_URL = "/media/"
# <- Настройки путей

# Настройки файлового хранилища
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
