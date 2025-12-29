from django.core.management.base import BaseCommand
from notifications.models import NotificationTemplate, NotificationEvent

class Command(BaseCommand):
    help = 'إنشاء قوالب الإشعارات الافتراضية للنظام'

    def handle(self, *args, **kwargs):
        # قائمة القوالب
        templates_data = [
            # --- قوالب المستخدم (User) ---
            {
                "event_type": NotificationEvent.STRATEGY_GENERATED,
                "title": "🧠 استراتيجية مشروعك جاهزة!",
                "body": "لقد انتهى الذكاء الاصطناعي من تحليل مشروع '{project_title}'. اضغط هنا لاستعراض الحلول المقترحة.",
                "icon": "brain"
            },
            {
                "event_type": NotificationEvent.AI_NEEDS_INFO,
                "title": "⚠️ نحتاج تفاصيل أكثر",
                "body": "وصف المشروع الحالي قصير جداً. لكي يعطيك الذكاء الاصطناعي نتائج دقيقة لمشروع '{project_title}'، يرجى إضافة المزيد من التفاصيل.",
                "icon": "warning"
            },
            {
                "event_type": NotificationEvent.FIRST_LEAD,
                "title": "🌟 مبروك! أول مشترك معك",
                "body": "قام '{name}' بالتسجيل في صفحة مشروعك. بداية موفقة!",
                "icon": "star"
            },
            {
                "event_type": NotificationEvent.READY_TO_LAUNCH,
                "title": "🚀 مشروعك جاهز للإطلاق!",
                "body": "تهانينا يا {name}! مشروعك '{project_title}' وصل للعدد المطلوب من المشتركين ({signups}). أنت جاهز للانتقال لمنصة التمويل.",
                "icon": "rocket"
            },
            
            # --- قوالب الأدمن (Admin) ---
            {
                "event_type": NotificationEvent.HIGH_POTENTIAL_PROJECT,
                "title": "💎 مشروع واعد جداً!",
                "body": "المشروع '{project_title}' ينمو بسرعة. عدد المسجلين وصل ({signups}). يرجى متابعة المالك.",
                "icon": "gem"
            },
            {
                "event_type": NotificationEvent.SUSPICIOUS_CONTENT,
                "title": "🚨 تنبيه أمني: محتوى مشبوه",
                "body": "المالك {owner_name} يستخدم كلمات محظورة في مشروع '{project_title}'. السبب: {reason}. يرجى المراجعة فوراً.",
                "icon": "shield"
            },
            {
                "event_type": NotificationEvent.SYSTEM_ALERT,
                "title": "⚠️ عطل تقني في النظام",
                "body": "حدث خطأ تقني: {error_msg}. يرجى التحقق من السيرفر.",
                "icon": "server"
            }
        ]

        self.stdout.write("جاري إنشاء القوالب...")

        for t in templates_data:
            obj, created = NotificationTemplate.objects.get_or_create(
                event_type=t["event_type"],
                defaults={
                    "title_template": t["title"],
                    "body_template": t["body"],
                    "send_in_app": True,
                    "send_email": False
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"✅ تم إنشاء قالب: {t['event_type']}"))
            else:
                self.stdout.write(self.style.WARNING(f"ℹ️ القالب موجود مسبقاً: {t['event_type']}"))

        self.stdout.write(self.style.SUCCESS("تم الانتهاء بنجاح! 🚀"))