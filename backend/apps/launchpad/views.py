from rest_framework import viewsets, permissions, decorators, status, parsers
from rest_framework.response import Response
from .models import LandingPage, ProjectLead
from .serializers import LandingPageSerializer, ProjectLeadSerializer

class LandingPageViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    queryset = LandingPage.objects.all()
    serializer_class = LandingPageSerializer
    # لدعم رفع الصور (Multipart) والبيانات العادية (JSON)
    parser_classes = (parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser)

    def get_permissions(self):
        # السماح للجميع برؤية الصفحة (GET) وتتبع الزيارة
        # السماح فقط للمالك بالتعديل (سيتم التعامل معها عبر التوكن في الـ settings)
        if self.action in ['retrieve', 'track_visit', 'track_share']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @decorators.action(detail=True, methods=['post'])
    def track_visit(self, request, slug=None):
        """ زيادة عداد الزيارات """
        page = self.get_object()
        page.views_count += 1
        page.save()
        return Response({"status": "counted"})

    @decorators.action(detail=True, methods=['post'])
    def track_share(self, request, slug=None):
        """ زيادة عداد المشاركات """
        page = self.get_object()
        page.shares_count += 1
        page.save()
        return Response({"status": "counted"})

class ProjectLeadViewSet(viewsets.ModelViewSet):
    queryset = ProjectLead.objects.all()
    serializer_class = ProjectLeadSerializer
    # السماح لأي زائر بإرسال الرد

    def perform_create(self, serializer):
        # عند حفظ الرد، نزيد عداد التسجيلات في الصفحة
        lead = serializer.save()
        lead.landing_page.current_signups += 1
        lead.landing_page.save()
    def get_permissions(self):
        # السماح للزوار بالإنشاء (POST) فقط
        if self.action == 'create':
            return [permissions.AllowAny()]
        # أما القراءة (GET List) فهي للمالك المسجل فقط
        return [permissions.IsAuthenticated()]

    # def get_queryset(self):
    #     # المالك يرى فقط الردود التابعة لمشاريعه
    #     user = self.request.user
    #     if user.is_authenticated:
    #         # هات لي الردود -> التي تتبع صفحات -> تتبع مشاريع -> يملكها هذا المستخدم
    #         return ProjectLead.objects.filter(landing_page__project__owner=user)
    #     return ProjectLead.objects.none() # لا ترجع شيئاً للغريب
    def get_queryset(self):
        queryset = super().get_queryset()
        # نلتقط المعامل landing_page من الرابط
        page_id = self.request.query_params.get('landing_page')
        
        if page_id:
            # إذا تم إرسال الرقم، نفلتر النتائج بناءً عليه
            return queryset.filter(landing_page_id=page_id)
        
        return queryset

