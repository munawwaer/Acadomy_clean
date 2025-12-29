# notifications/services.py
from .models import Notification, NotificationTemplate, NotificationEvent
from django.contrib.auth import get_user_model
User = get_user_model()
class Notify:
    @staticmethod
    def send(event_type, recipient, context=None, action_url=None, icon="bell"):
        """
        دالة مركزية لإرسال الإشعارات.
        
        Args:
            event_type: نوع الحدث (من NotificationEvent)
            recipient: المستخدم المستلم
            context: قاموس البيانات لتعويض المتغيرات في النص (مثلاً {'name': 'أحمد'})
            action_url: رابط التوجيه
            icon: شكل الأيقونة
        """
        if context is None:
            context = {}

        try:
            # 1. البحث عن القالب المناسب
            template = NotificationTemplate.objects.get(event_type=event_type)
            
            # 2. تجهيز النصوص (دمج المتغيرات مع القالب)
            # نستخدم .format لتغيير {name} إلى "أحمد"
            try:
                final_title = template.title_template.format(**context)
                final_message = template.body_template.format(**context)
            except KeyError as e:
                # في حال نسي المبرمج إرسال متغير مطلوب في النص
                print(f"Notification Error: Missing context variable {e}")
                final_title = template.title_template
                final_message = template.body_template

            # 3. الإرسال داخل الموقع (In-App)
            if template.send_in_app:
                Notification.objects.create(
                    recipient=recipient,
                    event_type=event_type,
                    title=final_title,
                    message=final_message,
                    action_url=action_url,
                    icon=icon,
                    data=context # نحتفظ بالبيانات الأصلية للأرشيف
                )

            # 4. الإرسال عبر الإيميل (مستقبلاً)
            if template.send_email and recipient.email:
                # TODO: استدعاء دالة إرسال الإيميلات هنا
                # send_mail_task.delay(recipient.email, final_title, final_message)
                pass

        except NotificationTemplate.DoesNotExist:
            print(f"Warning: No template found for event '{event_type}'. Please create it in Admin.")






     # 👇👇 هذه الدالة الجديدة للإدارة 👇👇
    @staticmethod
    def send_to_admins(event_type, context=None, action_url=None, icon="shield"):
        """
        إرسال إشعار لكل المدراء (Superusers) دفعة واحدة
        """
        # 1. جلب كل من لديه صلاحية أدمن
        admins = User.objects.filter(is_superuser=True)
        
        if not admins.exists():
            print("Warning: No admins found to receive the alert!")
            return

        print(f"🔔 Sending admin alert '{event_type}' to {admins.count()} admins.")

        # 2. التكرار عليهم وإرسال الإشعار لكل واحد
        for admin in admins:
            Notify.send(
                event_type=event_type,
                recipient=admin,
                context=context,
                action_url=action_url,
                icon=icon
            )
