from django.urls import path
from .views import RegisterView, ChangePasswordView, UserProfileView,DashboardStatsView,AdminStatsView
# لتسجيل الدخول نستخدم الـ Token الجاهز من Rest Framework مؤقتاً
from rest_framework.authtoken.views import obtain_auth_token 

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', obtain_auth_token, name='login'), # يعطيك التوكن مقابل الإيميل والباسورد
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('dashboard/stats/', DashboardStatsView.as_view()),
    path('admin/stats/', AdminStatsView.as_view()),
]