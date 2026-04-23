from django.urls import path
from . import views

urlpatterns = [
    path("preferences/", views.PreferenceSyncView.as_view(), name="sync-preferences"),
    path("bookmarks/", views.BookmarkSyncView.as_view(), name="sync-bookmarks"),
    path("adhkar-progress/", views.AdhkarProgressSyncView.as_view(), name="sync-adhkar-progress"),
]
