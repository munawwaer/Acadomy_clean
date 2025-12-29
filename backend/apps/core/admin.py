from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # الحقول التي تظهر في قائمة المستخدمين (Table View)
    list_display = ('email', 'full_name', 'plan_tier', 'is_verified', 'last_login_ip', 'created_at')
    
    # الفلاتر الجانبية
    list_filter = ('plan_tier', 'is_verified', 'created_at')
    
    # حقل البحث
    search_fields = ('email', 'full_name', 'payment_customer_id')
    
    # الترتيب (الأحدث أولاً)
    ordering = ('-created_at',)

    # --- تنظيم صفحة تفاصيل المستخدم (Detail View) ---
    # يجب إعادة تعريفها لأننا حذفنا username
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('المعلومات الشخصية'), {'fields': ('full_name', 'phone_number', 'avatar', 'bio')}),
        (_('معلومات الاشتراك (Business)'), {'fields': ('plan_tier', 'payment_customer_id', 'referred_by')}),
        (_('التتبع والأمان'), {'fields': ('last_login_ip', 'current_location', 'device_info', 'last_login')}),
        (_('الصلاحيات'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('التواريخ'), {'fields': ('created_at', 'updated_at')}),
    )
    
    # الحقول المخصصة للقراءة فقط (عشان الأدمن ما يزور التواريخ)
    readonly_fields = ('created_at', 'updated_at', 'last_login_ip', 'device_info')

    # إعدادات مهمة لأننا نستخدم مودل مخصص
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'password', 'password_confirm'),
        }),
    )