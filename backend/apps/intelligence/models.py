from django.db import models
from core.models import BaseModel
from django.db import models
# لاحظ كيف نربط بتطبيق آخر باستخدام النص 'app_name.ModelName' لتجنب مشاكل الاستيراد
from core.models import BaseModel 

class ResearchReport(BaseModel):
    # الربط بالمشروع في التطبيق الآخر
    project = models.OneToOneField('incubation.Project', on_delete=models.CASCADE, related_name='research_report')
    
    # JSON للبيانات الخام (المنافسين)
    competitors_data = models.JSONField(default=list, blank=True)
    detected_problems = models.JSONField(default=list, blank=True)
    suggested_sources = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"Report: {self.project_id}"

class SolutionStrategy(BaseModel):
    project = models.OneToOneField('incubation.Project', on_delete=models.CASCADE, related_name='strategy')
    
    # بدلاً من حقل نصي واحد، نستخدم JSON لقائمة الحلول
    # الهيكل: [{"problem": "البطء", "solution": "سيرفرات سريعة"}, ...]
    problems_solutions_list = models.JSONField(default=list) 

    def __str__(self):
        return f"Strategy for {self.project.title}"

# لا نحتاج مودل ResearchReport هنا لأنه موجود في الكود السابق، تأكد فقط أنه موجود