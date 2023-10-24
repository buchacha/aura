from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings


# URL'ы приложения + статические файлы по адресу MEDIA_URL
urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/', include('backend_api.urls', namespace='backend_api')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
