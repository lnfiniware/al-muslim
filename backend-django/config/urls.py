"""al-muslim backend URL configuration."""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/sync/", include("apps.sync.urls")),
    path("api/notifications/", include("apps.notifications.urls")),
    path("api/feedback/", include("apps.feedback.urls")),
]
