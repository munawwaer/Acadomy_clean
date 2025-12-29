from rest_framework import viewsets, status, decorators
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # 🛡️ الحماية الأولى: هل Swagger هو من يطلب البيانات؟
        if getattr(self, 'swagger_fake_view', False):
            return Notification.objects.none()  # أعد قائمة فارغة ولا تزعج قاعدة البيانات

        # 🛡️ الحماية الثانية: هل المستخدم غير مسجل دخول؟
        if not self.request.user.is_authenticated:
            return Notification.objects.none()

        # ✅ الآن نحن متأكدون أنه مستخدم حقيقي ومعه UUID
        return Notification.objects.filter(recipient=self.request.user).order_by('-created_at')

    # ... (باقي الدوال كما هي mark_all_read و mark_read) ...
    # دالة إضافية لجعل الإشعارات "مقرؤة"
    @decorators.action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({"status": "success"})

    @decorators.action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({"status": "success"})