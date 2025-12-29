# from rest_framework import viewsets, permissions, status
# from rest_framework.response import Response
# from rest_framework.decorators import action
# from rest_framework.permissions import AllowAny # للسماح للزوار
# from .models import Project
# from .serializers import ProjectSerializer
# from .ai_engine import analyze_idea_with_ai # استدعاء محركنا الجديد

# class ProjectViewSet(viewsets.ModelViewSet):
#     serializer_class = ProjectSerializer
    
#     # التغيير الجوهري 1: السماح للجميع (مؤقتاً للإنشاء)
#     def get_permissions(self):
#         if self.action in ['create', 'analyze']:
#             return [AllowAny()]
#         return [permissions.IsAuthenticated()]

#     def get_queryset(self):
#         # إذا كان مسجلاً، نرجع مشاريعه
#         if self.request.user.is_authenticated:
#             return Project.objects.filter(owner=self.request.user)
#         # إذا كان زائراً، نرجع قائمة فارغة (للأمان، لا يرى مشاريع غيره)
#         # الزائر سيصل لمشروعه عبر الـ ID الذي يرجع له عند الإنشاء فقط
#         return Project.objects.none()

#     def perform_create(self, serializer):
#         # إذا كان مسجلاً نربطه، إذا زائر نتركه Null
#         if self.request.user.is_authenticated:
#             serializer.save(owner=self.request.user)
#         else:
#             serializer.save(owner=None)

#     @action(detail=True, methods=['post'])
#     def analyze(self, request, pk=None):
#         # نستخدم Project.objects.all() هنا لنستطيع جلب المشروع حتى لو كان الزائر غير مسجل
#         # (في الإنتاج الحقيقي، نستخدم Session ID للحماية، لكن هذا يكفي للمرحلة الحالية)
#         try:
#             project = Project.objects.get(pk=pk)
#         except Project.DoesNotExist:
#             return Response({"error": "المشروع غير موجود"}, status=404)

#         if project.status != Project.Status.DRAFT:
#             return Response({"error": "تم تحليل المشروع مسبقاً"}, status=400)

#         # 1. تغيير الحالة لـ Analyzing
#         project.status = Project.Status.ANALYZING
#         project.save()

#         # 2. استدعاء OpenAI الحقيقي
#         ai_result = analyze_idea_with_ai(
#             project.project_name, 
#             project.raw_description, 
#             project.target_audience
#         )

#         if not ai_result:
#             # فشل الاتصال، نعيد الحالة لمسودة
#             project.status = Project.Status.DRAFT
#             project.save()
#             return Response({"error": "فشل الاتصال بالذكاء الاصطناعي"}, status=503)

#         # 3. حفظ النتائج الحقيقية
#         project.refined_pitch = ai_result.get('refined_pitch', '')
#         project.ai_intelligence = ai_result.get('ai_intelligence', {})
#         project.draft_lp_content = ai_result.get('draft_lp_content', {})
        
#         project.token_cost += 500 # تكلفة تقريبية
#         project.version += 1
#         project.status = Project.Status.READY
        
#         project.save()

#         return Response(ProjectSerializer(project).data)
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Project
from .serializers import ProjectSerializer

# استيراد الأشياء التي بنيناها سابقاً
from intelligence.models import ResearchReport
from intelligence.engine import MarketSpyBot 

class ProjectViewSet(viewsets.ModelViewSet):
    # Lookup field هو uid بدلاً من id عشان الأمان (الروابط تكون طويلة وصعبة التخمين)
    lookup_field = 'id' 
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    # أهم نقطة: السماح للجميع (حتى بدون تسجيل دخول) بالإنشاء
    def get_permissions(self):
        if self.action in ['create', 'analyze']:
            return [permissions.AllowAny()]
        return [permissions.AllowAny()] # مؤقتاً اجعلها للكل، لاحقاً نغيرها للمالك فقط
    def get_queryset(self):
            # يرجع فقط مشاريع المستخدم الحالي
        return Project.objects.filter(owner=self.request.user).order_by('-created_at')

    # 👇👇 هذه هي الدالة السحرية المفقودة 👇👇
    def perform_create(self, serializer):
        # المعنى: عند الحفظ، اجعل المالك هو المستخدم الذي أرسل الطلب
        serializer.save(owner=self.request.user)
    @action(detail=True, methods=['post'])
    def analyze(self, request, id=None):
        project = self.get_object()
         
           # تمرر القطاع من المشروع للبوت
        bot = MarketSpyBot(
            project_title=project.title,
            description=project.raw_description,
            sector=project.target_sector  # <--- هنا التمرير المهم
        )
        results = bot.run() 
        
        # 2. حساب الملخص (نضعه في متغير عشان نستخدمه مرتين)
        # هذا هو السطر الذي يجمع المشاكل
        problems_summary = self._extract_summary(results['competitors'])

        # 3. الحفظ في القاعدة
        report, created = ResearchReport.objects.update_or_create(
            project=project,
            defaults={
                'competitors_data': results['competitors'],
                'detected_problems': problems_summary, # حفظنا الملخص هنا
                # 'suggested_sources': results['used_keywords']
                'suggested_sources': [f"{project.title} competitors",f"{project.target_sector} reviews"] 
            })

        project.stage = 'ANALYZED'
        project.save()

        # 4. الرد (هنا التعديل: أضفنا الملخص ليظهر لك)
        return Response({
            "status": "success",
            "summary_problems": problems_summary,  # <--- أضفنا هذا السطر لتراها بعينك
            "data": results['competitors']
        })
    def _extract_summary(self, competitors):
        """دالة مساعدة لاستخراج مشاكل مختصرة"""
        summary = []
        for comp in competitors:
            # نجمع المشاكل الموجودة فقط
            problems = comp.get('problems', {}) or {}
            if problems.get('technical'): summary.extend(problems['technical'])
            if problems.get('financial'): summary.extend(problems['financial'])
            if problems.get('service'): summary.extend(problems['service'])
        return summary[:5] # نأخذ أول 5 فقط
    



