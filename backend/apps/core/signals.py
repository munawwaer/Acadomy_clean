from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from notifications.services import Notify
from notifications.models import NotificationEvent

User = get_user_model()

@receiver(post_save, sender=User)
def send_welcome_notification(sender, instance, created, **kwargs):
    """
    إرسال إشعار ترحيبي عند إنشاء حساب مستخدم جديد
    """
    if created:
        # تحديد الاسم الذي سيظهر في الرسالة (الاسم الأول أو الإيميل)
        user_name = instance.first_name if instance.first_name else instance.email.split('@')[0]

        Notify.send(
            event_type=NotificationEvent.WELCOME_USER,
            recipient=instance,
            context={'name': user_name},
            icon="hand-wave", # أيقونة يد تلوح 👋
            action_url="/new-project" # يوجهه لإنشاء مشروع فوراً
        )