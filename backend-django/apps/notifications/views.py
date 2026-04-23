from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import DeviceToken
from .serializers import DeviceTokenSerializer


class RegisterTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DeviceTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        DeviceToken.objects.update_or_create(
            token=serializer.validated_data["token"],
            defaults={"user": request.user, "platform": serializer.validated_data.get("platform", "android"), "is_active": True},
        )
        return Response({"message": "Token registered successfully"}, status=status.HTTP_201_CREATED)
