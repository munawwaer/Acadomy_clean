
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from core.models import BaseModel

class Project(BaseModel):
    # --- GPS المراحل (كما شرحنا سابقاً) ---
    class Stage(models.TextChoices):
        IDEA = 'IDEA', _('فكرة جديدة')
        RESEARCHING = 'RESEARCHING', _('جاري البحث')
        ANALYZED = 'ANALYZED', _('تم التحليل')
        STRATEGY_SET = 'STRATEGY_SET', _('تم تحديد الحل')
        LANDING_PAGE = 'LANDING_PAGE', _('صفحة الهبوط جاهزة')
        PUBLISHED = 'PUBLISHED', _('منشور')
        VALIDATED = 'VALIDATED', _('تم التحقق')

    class Sector(models.TextChoices):
        TECH = 'TECH', 'تطبيق / تقنية'
        FOOD = 'FOOD', 'مقهى / مطعم'
        REAL_ESTATE = 'REAL_ESTATE', 'عقار / مقاولات'
        GENERAL = 'GENERAL', 'عام'

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='projects',
        null=True, blank=True
    )

    title = models.CharField(max_length=255)
    raw_description = models.TextField()
   
    target_sector = models.CharField(
        max_length=50, 
        choices=Sector.choices, 
        default=Sector.GENERAL
    )
    stage = models.CharField(max_length=20, choices=Stage.choices, default=Stage.IDEA)
    settings = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return self.title
    

