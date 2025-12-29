from django.db import models
from core.models import BaseModel

class LandingPage(BaseModel):
    # الربط بالمشروع
    project = models.OneToOneField('incubation.Project', on_delete=models.CASCADE, related_name='landing_page')
    slug = models.SlugField(unique=True, max_length=100)
    
    # المحتوى الأساسي
    main_headline = models.CharField(max_length=255)
    sub_headline = models.TextField(blank=True)
    
    # شعار المشروع أو الصورة الرمزية (متاحة للكل)
    project_logo = models.ImageField(upload_to='project_logos/', null=True, blank=True)
    
    # بطاقات الميزات (نخزنها كـ JSON لتكون مرنة: 3 للمجاني، أكثر للمدفوع)
    # الشكل: [{"title": "..", "desc": ".."}, ...]
    features_list = models.JSONField(default=list, blank=True)
    
    # إعدادات التصميم (الألوان)
    theme_config = models.JSONField(default=dict)
    
    # تحليلات بسيطة للصفحة
    views_count = models.PositiveIntegerField(default=0)
    shares_count = models.PositiveIntegerField(default=0)
    current_signups = models.IntegerField(default=0)
    
    is_published = models.BooleanField(default=False)

    def __str__(self):
        return self.slug

class PageQuestion(BaseModel):
    class FieldType(models.TextChoices):
        TEXT = 'TEXT', 'سؤال نصي'
        CHOICE = 'CHOICE', 'اختيار من متعدد'
        IMAGE_VOTE = 'IMAGE_VOTE', 'مقارنة صور (مدفوع)'

    landing_page = models.ForeignKey(LandingPage, on_delete=models.CASCADE, related_name='questions')
    
    question_text = models.CharField(max_length=255)
    field_type = models.CharField(max_length=20, choices=FieldType.choices, default=FieldType.TEXT)
    
    # خيارات النصوص (للاختيار من متعدد)
    options = models.JSONField(default=list, blank=True, null=True)

    # صور المقارنة (تظهر فقط إذا اخترنا IMAGE_VOTE)
    image_a = models.ImageField(upload_to='questions/ab_test/', null=True, blank=True)
    image_b = models.ImageField(upload_to='questions/ab_test/', null=True, blank=True)
    
    # الترتيب
    order = models.IntegerField(default=0)
    
    # ملاحظة: حذفنا العدادات، سنحسبها برمجياً

class ProjectLead(BaseModel):
    landing_page = models.ForeignKey(LandingPage, on_delete=models.CASCADE, related_name='leads')
    
    # جعلنا الإيميل والاسم اختياريين، ربما الزائر يريد التصويت فقط دون كشف هويته
    email = models.EmailField(blank=True, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    
    # هنا نخزن الإجابات
    # مثال للإجابة على مقارنة الصور: { "question_id_5": "image_a" }
    answers_data = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-created_at']