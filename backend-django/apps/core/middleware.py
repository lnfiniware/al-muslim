"""Audit logging middleware."""
import logging
from django.utils import timezone

logger = logging.getLogger("apps.core.audit")


class AuditLogMiddleware:
    """
    Logs all write operations (POST, PUT, PATCH, DELETE) with
    user, IP, path, and timestamp for security auditing.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if request.method in ("POST", "PUT", "PATCH", "DELETE"):
            user = getattr(request, "user", None)
            user_str = user.email if user and user.is_authenticated else "anonymous"
            ip = self._get_client_ip(request)
            logger.info(
                "AUDIT: method=%s path=%s user=%s ip=%s status=%s time=%s",
                request.method,
                request.path,
                user_str,
                ip,
                response.status_code,
                timezone.now().isoformat(),
            )

        return response

    @staticmethod
    def _get_client_ip(request):
        x_forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded:
            return x_forwarded.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR")
