"""Sync views for preference, bookmark, and progress synchronization."""
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import SyncedPreference, SyncedBookmark, SyncedAdhkarProgress
from .serializers import SyncedPreferenceSerializer, SyncedBookmarkSerializer, SyncedAdhkarProgressSerializer


class PreferenceSyncView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        prefs, _ = SyncedPreference.objects.get_or_create(user=request.user)
        return Response(SyncedPreferenceSerializer(prefs).data)

    def post(self, request):
        prefs, _ = SyncedPreference.objects.get_or_create(user=request.user)
        serializer = SyncedPreferenceSerializer(prefs, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class BookmarkSyncView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookmarks = SyncedBookmark.objects.filter(user=request.user)
        return Response(SyncedBookmarkSerializer(bookmarks, many=True).data)

    def post(self, request):
        results = []
        for item in request.data:
            obj, created = SyncedBookmark.objects.update_or_create(
                user=request.user,
                surah_number=item["surah_number"],
                ayah_number=item["ayah_number"],
                defaults={"surah_name": item.get("surah_name", "")},
            )
            results.append(obj)
        return Response(SyncedBookmarkSerializer(results, many=True).data, status=status.HTTP_201_CREATED)


class AdhkarProgressSyncView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        progress = SyncedAdhkarProgress.objects.filter(user=request.user)
        return Response(SyncedAdhkarProgressSerializer(progress, many=True).data)

    def post(self, request):
        results = []
        for item in request.data:
            obj, _ = SyncedAdhkarProgress.objects.update_or_create(
                user=request.user,
                adhkar_id=item["adhkar_id"],
                defaults={"current_count": item.get("current_count", 0)},
            )
            results.append(obj)
        return Response(SyncedAdhkarProgressSerializer(results, many=True).data, status=status.HTTP_201_CREATED)
