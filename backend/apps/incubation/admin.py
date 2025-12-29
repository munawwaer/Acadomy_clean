from django.contrib import admin
from .models import Project

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = [
        'id', 
        'title', 
        'owner',       # 👈 هذا العمود هو الأهم الآن
        'stage', 
        'created_at'
    ]
    
    list_filter = ['stage', 'created_at']
    search_fields = ['title', 'description', 'owner__email', 'owner__username']
    
    # السماح بتعديل المالك مباشرة من القائمة (اختياري، للسرعة)
    list_editable = ['owner', 'stage']