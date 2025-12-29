from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StrategyViewSet

router = DefaultRouter()
# router.register(r'reports', ResearchReportViewSet, basename='report')
router.register(r'strategies', StrategyViewSet, basename='strategy')

urlpatterns = [
    path('', include(router.urls)),
]