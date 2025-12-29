from django.contrib import admin
from .models import NotificationTemplate, Notification

@admin.register(NotificationTemplate)
class NotificationTemplateAdmin(admin.ModelAdmin):
    list_display = ('event_type', 'title_template', 'send_in_app', 'send_email')
    search_fields = ('event_type', 'title_template')

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('recipient', 'title', 'event_type', 'is_read', 'created_at')
    list_filter = ('is_read', 'event_type', 'created_at')
    search_fields = ('recipient__email', 'title')
    readonly_fields = ('created_at',) # الإشعار للتاريخ لا يجب تعديله