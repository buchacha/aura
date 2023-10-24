# -*- coding: utf-8 -*-
import os
import sys

from django.core.wsgi import get_wsgi_application


sys.path.insert(0, '/var/www/default/data/www/api.aura-ai.site/VoiceMatch')
sys.path.insert(1, '/var/www/default/data/www/api.aura-ai.site/.venv/lib/python3.10/site-packages')
os.environ['DJANGO_SETTINGS_MODULE'] = 'VoiceMatch.settings'

application = get_wsgi_application()
