from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LandingPageViewSet, ProjectLeadViewSet

router = DefaultRouter()
router.register(r'pages', LandingPageViewSet, basename='landing-page')
router.register(r'leads', ProjectLeadViewSet, basename='lead')

urlpatterns = [
    path('', include(router.urls)),
]