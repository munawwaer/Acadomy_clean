# from django.contrib import admin
# from django.urls import path, include  # تأكد من استيراد include

# urlpatterns = [
#     path('admin/', admin.site.urls),
    
#     # هنا بوابة الـ API الخاصة بنا
#     # أي رابط يبدأ بـ api/v1/incubation سيذهب لتطبيق المعمل
#     path('api/v1/incubation/', include('incubation.urls')),
# ]


from django.contrib import admin
from django.urls import path, include
from django.conf import settings             # <--- جديد
from django.conf.urls.static import static  
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi





urlpatterns = [
    path('admin/', admin.site.urls),

    
]

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# إعدادات التوثيق
schema_view = get_schema_view(
   openapi.Info(
      title="Kickstarter Clone API",
      default_version='v1',
      description="توثيق كامل لجميع الروابط للمشروع",
      contact=openapi.Contact(email="contact@myproject.com"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)


urlpatterns = [

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('admin/', admin.site.urls),
    
    # نستخدم prefixes واضحة لكل تطبيق
    path('api/v1/projects/', include('incubation.urls')),       # أفكار ومشاريع
    path('api/v1/intelligence/', include('intelligence.urls')), # تقارير واستراتيجيات
    path('api/v1/launchpad/', include('launchpad.urls')),     # صفحات هبوط وزوار
    path('api/v1/core/', include('core.urls')),     # صفحات هبوط وزوار
    # ... روابط تطبيقاتك السابقة ...
    path('api/v1/notifications/', include('notifications.urls')), # مثال

    # 👇👇 روابط التوثيق (السحرية) 👇👇
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]



if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)