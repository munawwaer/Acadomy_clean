from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import SolutionStrategy  # 👈 تأكد من اسم المودل حق الاستراتيجية
from notifications.services import Notify
from notifications.models import NotificationEvent

@receiver(post_save, sender=SolutionStrategy)
def notify_strategy_ready(sender, instance, created, **kwargs):
    """
    إرسال إشعار عند اكتمال توليد الاستراتيجية
    """
    if created:
        project = instance.project
        
        # التأكد من وجود مالك للمشروع
        if project.owner:
            owner = project.owner
            owner_name = owner.email if owner.email else owner.username

            Notify.send(
                event_type=NotificationEvent.STRATEGY_GENERATED,
                recipient=owner,
                context={
                    'name': owner_name,  # 👈 أضفنا الاسم لكي لا يظهر خطأ
                    'project_title': project.title
                },
                # رابط يوجه المستخدم مباشرة لتبويب الاستراتيجية
                action_url=f"/project/{project.id}/strategy",
                icon="brain"
            )
            print(f"🧠 Strategy Notification sent to {owner.email}")