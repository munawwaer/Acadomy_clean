# intelligence/views.py

from notifications.services import Notify
from notifications.models import NotificationEvent

from rest_framework import viewsets, status, decorators,permissions
from rest_framework.response import Response

from .models import SolutionStrategy
from .serializers import SolutionStrategySerializer
from incubation.models import Project
from launchpad.models import LandingPage
from .ai_wrapper import GeminiBrain
from launchpad.serializers import LandingPageSerializer

class StrategyViewSet(viewsets.ModelViewSet):
    queryset = SolutionStrategy.objects.all()
    serializer_class = SolutionStrategySerializer

    @decorators.action(detail=False, methods=['post'])
    def generate_proposal(self, request):
        project_uid = request.data.get('project')
        project = Project.objects.get(id=project_uid)
        
        # 1. تحديد المشاكل
        all_problems = project.research_report.detected_problems
        is_premium = request.user.is_authenticated and request.user.plan_tier != 'FREE'
        visible_problems = all_problems if is_premium else all_problems[:3]
        
        # 2. طلب الحلول (التعديل هنا) 👇
        brain = GeminiBrain()
        
        suggestions = brain.suggest_solutions_for_problems(
            problems_list=visible_problems,
            project_title=project.title,              # مررنا الاسم
            project_description=project.raw_description # مررنا الوصف الخام
        )
           # بعد الحصول على suggestions من الذكاء الاصطناعي
        suggestions_text = str(suggestions)
    
        # قائمة كلمات محظورة بسيطة (يمكن تطويرها لاحقاً)
        black_list = ['احتيال', 'تهريب', 'hack', 'scam']
    
        for word in black_list:
            if word in suggestions_text:
            # إرسال إنذار للمدراء
             Notify.send_to_admins(
                event_type=NotificationEvent.SUSPICIOUS_CONTENT,
                context={
                    'project_title': project.title,
                    'owner_name': request.user.get_full_name() or request.user.username,
                    'reason': f"تم رصد كلمة: {word}"
                },
                action_url=f"/admin/incubation/project/{project.id}/change/", # رابط للمراجعة في الأدمن
                icon="warning"
            )
            break # يكفي إنذار واحد

        # 3. الحفظ والرد (كما هو)
        strategy, _ = SolutionStrategy.objects.update_or_create(
            project=project,
            defaults={'problems_solutions_list': suggestions}
        )
        
        return Response({
            "status": "review_required",
            "message": "تم اقتراح الحلول بناءً على طبيعة مشروعك.",
            "strategy_id": strategy.id,
            "suggestions": suggestions
        })
    @decorators.action(detail=True, methods=['post'])
    def build_landing_page(self, request, pk=None):
        strategy = self.get_object()
        project = strategy.project
        
        # 1. استقبال الحلول وتحديثها (نفس السابق)
        incoming_solutions = request.data.get('approved_solutions')
        if incoming_solutions:
            strategy.problems_solutions_list = incoming_solutions
            strategy.save()
        
        final_solutions = strategy.problems_solutions_list

        # 2. استدعاء الذكاء الاصطناعي
        brain = GeminiBrain()
        creative_copy = brain.generate_landing_copy(
            project_title=project.title,
            raw_description=project.raw_description,
            approved_solutions_list=final_solutions
        )

        # استخراج الاسم المقترح
        suggested_name = creative_copy.get('suggested_brand_name', project.title)

        landing_page = LandingPage.objects.create(
            project=project,
            slug=f"p-{str(project.id)[:8]}",
            main_headline=creative_copy.get('main_headline'),
            sub_headline=creative_copy.get('sub_headline'),
            features_list=creative_copy.get('features', []),
            theme_config={
                "id": "theme_1", 
                "primary": "#2563EB", 
                "bg": "#FFFFFF",
                "brand_name": creative_copy.get('suggested_brand_name')
            }
        )
        
        project.stage = 'STRATEGY_SET'
        project.save()

        # --- التغيير هنا: إرجاع الكائن كاملاً ---
        
        # نحول الكائن الذي أنشأناه للتو إلى JSON
        serializer = LandingPageSerializer(landing_page)
        
        # نرجعه في الرد
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    


 

