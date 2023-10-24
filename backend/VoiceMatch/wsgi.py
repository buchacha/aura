import os

from django.core.wsgi import get_wsgi_application


# Установка переменной DJANGO_SETTINGS_MODULE
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'VoiceMatch.settings')
# Инициализация WSGI
application = get_wsgi_application()
