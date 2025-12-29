from django.apps import AppConfig

class LaunchpadConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'launchpad'

    def ready(self):
        # 👇 هذا السطر هو الذي يشغل ملف الإشارات
        import launchpad.signals