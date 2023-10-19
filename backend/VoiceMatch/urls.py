from django.contrib import admin
from django.urls import path, include
from backend_api.views import *
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/', include('backend_api.urls', namespace='backend_api')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
