from django.db import models
from django.contrib.auth import get_user_model
from core.models import BaseModel 

User = get_user_model()

class NotificationEvent(models.TextChoices):
    WELCOME_USER = 'WELCOME_USER', 'ترحيب بالمستخدم' 
    # --- أحداث الحضانة (Incubation) ---
    STRATEGY_GENERATED = 'STRATEGY_GENERATED', 'تم توليد الاستراتيجية'
    AI_NEEDS_INFO = 'AI_NEEDS_INFO', 'الذكاء يحتاج تفاصيل إضافية'
    
    # --- أحداث صفحة الإطلاق (Launchpad) ---
    FIRST_LEAD = 'FIRST_LEAD', 'أول مشترك (Lead)'
    READY_TO_LAUNCH = 'READY_TO_LAUNCH', 'المشروع جاهز للإطلاق (40 مشترك)'
    
    # --- أحداث النظام والأدمن (التي كان يشتكي منها الكود) ---
    HIGH_POTENTIAL_PROJECT = 'HIGH_POTENTIAL_PROJECT', 'مشروع واعد (للأدمن)'
    SUSPICIOUS_CONTENT = 'SUSPICIOUS_CONTENT', 'محتوى مشبوه (للأدمن)'
    SYSTEM_ALERT = 'SYSTEM_ALERT', 'تنبيه نظام (للأدمن)'

class NotificationTemplate(BaseModel):
    event_type = models.CharField(
        max_length=50, 
        choices=NotificationEvent.choices, 
        unique=True,
        verbose_name="نوع الحدث"
    )
    
    title_template = models.CharField(max_length=255, verbose_name="قالب العنوان")
    body_template = models.TextField(verbose_name="قالب نص الرسالة")
    
    send_in_app = models.BooleanField(default=True, verbose_name="إرسال داخل الموقع")
    send_email = models.BooleanField(default=False, verbose_name="إرسال إيميل")
    
    def __str__(self):
        return self.get_event_type_display()

class Notification(BaseModel):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    event_type = models.CharField(max_length=50, choices=NotificationEvent.choices)
    
    title = models.CharField(max_length=255)
    message = models.TextField()
    
    icon = models.CharField(max_length=50, default="bell") 
    action_url = models.CharField(max_length=500, null=True, blank=True)
    
    is_read = models.BooleanField(default=False)
    data = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.recipient} - {self.title}"