"""Account URL routing."""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path("register/", views.RegisterView.as_view(), name="register"),
    path("login/", views.LoginView.as_view(), name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("profile/", views.ProfileView.as_view(), name="profile"),
    path("sessions/", views.DeviceSessionListView.as_view(), name="sessions-list"),
    path("sessions/<uuid:pk>/", views.DeviceSessionDeleteView.as_view(), name="sessions-delete"),
]
