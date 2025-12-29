from django.contrib import admin
from .models import LandingPage, PageQuestion, ProjectLead

@admin.register(LandingPage)
class LandingPageAdmin(admin.ModelAdmin):
    # الأعمدة التي ستظهر في الجدول
    list_display = [
        'id', 
        'slug', 
        'get_project_title',  # دالة مخصصة لجلب اسم المشروع
        'get_owner',          # دالة مخصصة لجلب المالك (للتأكد من الربط)
        'current_signups',    # عدد المسجلين
        'views_count',        # عدد الزوار
        'is_published', 
        'created_at'
    ]
    
    # الفلاتر الجانبية
    list_filter = ['is_published', 'created_at']
    
    # مربع البحث
    search_fields = ['slug', 'main_headline', 'project__title', 'project__owner__email']
    
    # جعل هذه الحقول للقراءة فقط لتجنب التلاعب اليدوي
    readonly_fields = ['current_signups', 'views_count', 'shares_count']

    # --- دوال مساعدة لجلب بيانات من جداول مرتبطة ---
    @admin.display(description='Project Title')
    def get_project_title(self, obj):
        return obj.project.title if obj.project else "⚠️ No Project"

    @admin.display(description='Owner')
    def get_owner(self, obj):
        return obj.project.owner.email if (obj.project and obj.project.owner) else "❌ ORPHAN (No Owner)"

@admin.register(PageQuestion)
class PageQuestionAdmin(admin.ModelAdmin):
    list_display = ['id', 'question_text', 'field_type', 'landing_page', 'order']
    list_filter = ['field_type']
    search_fields = ['question_text']

@admin.register(ProjectLead)
class ProjectLeadAdmin(admin.ModelAdmin):
    list_display = [
        'id', 
        'email', 
        'name', 
        'landing_page', 
        'get_answers_summary', # عرض مختصر للإجابات
        'created_at'
    ]
    
    list_filter = ['created_at', 'landing_page']
    search_fields = ['email', 'name', 'landing_page__slug']
    
    # دالة لعرض الإجابات بشكل جميل بدلاً من كود JSON طويل
    @admin.display(description='Answers Data')
    def get_answers_summary(self, obj):
        if not obj.answers_data:
            return "-"
        # يعرض عدد الإجابات وأول إجابة فقط كمثال
        return f"{len(obj.answers_data)} answers (Preview: {str(obj.answers_data)[:50]}...)"