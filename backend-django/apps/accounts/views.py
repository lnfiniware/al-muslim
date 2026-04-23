"""Account API views."""
from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import DeviceSession
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserProfileSerializer,
    DeviceSessionSerializer,
)


class RegisterView(generics.CreateAPIView):
    """Register a new user account."""
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserProfileSerializer(user).data,
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """Authenticate user and return JWT tokens."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        user.failed_login_attempts = 0
        user.save(update_fields=["failed_login_attempts"])
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserProfileSerializer(user).data,
        })


class ProfileView(generics.RetrieveUpdateAPIView):
    """Get or update the authenticated user's profile."""
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class DeviceSessionListView(generics.ListAPIView):
    """List active device sessions."""
    serializer_class = DeviceSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DeviceSession.objects.filter(user=self.request.user)


class DeviceSessionDeleteView(generics.DestroyAPIView):
    """Delete (revoke) a device session."""
    serializer_class = DeviceSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DeviceSession.objects.filter(user=self.request.user)
