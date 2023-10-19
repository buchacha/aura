# -*- coding: utf-8 -*-
import os, sys
sys.path.insert(0, '/var/www/default/data/www/api.aura-ai.site/VoiceMatch')
sys.path.insert(1, '/var/www/default/data/www/api.aura-ai.site/.venv/lib/python3.10/site-packages')
os.environ['DJANGO_SETTINGS_MODULE'] = 'VoiceMatch.settings'
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()