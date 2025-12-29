from django.apps import AppConfig

class IntelligenceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'intelligence'

    def ready(self):
        # 👇 استدعاء ملف الإشارات الجديد
        import intelligence.signals