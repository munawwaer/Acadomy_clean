from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import LandingPage, ProjectLead
from notifications.services import Notify
from notifications.models import NotificationEvent

# --- 1. الإشارة الأولى: (تعمل مع كل مشترك جديد) ---
@receiver(post_save, sender=ProjectLead)
def update_landing_page_stats(sender, instance, created, **kwargs):
    if created:
        # أ) تحديث العداد
        page = instance.landing_page
        page.current_signups += 1
        page.save()

        # ب) إرسال إشعار للمالك
        if page.project and page.project.owner:
            owner = page.project.owner
            
            # 👇👇 التصحيح هنا 👇👇
            # "instance" هو المشترك (ProjectLead)
            # نريد اسم المشترك أو إيميله ليظهر في نص الرسالة
            subscriber_info = instance.name if instance.name else instance.email

            Notify.send(
                event_type=NotificationEvent.FIRST_LEAD,
                recipient=owner,       # المستلم هو المالك (صحيح)
                context={'name': subscriber_info}, # ✅ البيانات المرسلة للقالب هي بيانات المشترك
                icon="user-plus"
            )

# --- 2. الإشارة الثانية: (أحداث الإطلاق فقط) ---
@receiver(post_save, sender=LandingPage)
def monitor_subscribers_count(sender, instance, **kwargs):
    if not instance.project or not instance.project.owner:
        return
        
    owner = instance.project.owner
    # هنا نحتاج اسم المالك للتهنئة، لذا نستخدم owner.email
    owner_display = owner.email if owner.email else owner.username

    if instance.current_signups == 40:
        Notify.send(
            event_type=NotificationEvent.READY_TO_LAUNCH,
            recipient=owner,
            context={
                'name': owner_display,  # هنا المالك هو المخاطب بالتهنئة
                'project_title': instance.project.title,
                'signups': instance.current_signups
            },
            action_url=f"/dashboard/projects/{instance.project.id}/launch/",
            icon="rocket"
        )