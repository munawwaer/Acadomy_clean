from launchpad.serializers import LandingPageSerializer
from rest_framework import serializers
from .models import Project
from intelligence.serializers import ResearchReportSerializer 
from intelligence.serializers import   serializers
class ProjectSerializer(serializers.ModelSerializer):
    stage_display = serializers.CharField(source='get_stage_display', read_only=True)
    research_report = ResearchReportSerializer(read_only=True)
    landing_page_slug = serializers.SerializerMethodField()
    
    # 👇 الإضافة الجديدة: حقل الاستراتيجية
    strategy = serializers.SerializerMethodField()
# إضافة هذا الحقل لكي تظهر البيانات في القائمة
    landing_page = LandingPageSerializer(read_only=True)
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'raw_description', 'target_sector', 
            'stage', 'stage_display', 'created_at',
            'research_report', 
            'landing_page_slug',
            'strategy', # 👈 لا تنس إضافته هنا
            'landing_page',
            'owner'
        ]
        read_only_fields = ['id', 'stage', 'created_at']

    def get_landing_page_slug(self, obj):
        if hasattr(obj, 'landing_page'):
            return obj.landing_page.slug
        return None

    # 👇 الدالة التي تجلب الاستراتيجية المحفوظة
    def get_strategy(self, obj):
        # نحاول الوصول للاستراتيجية المرتبطة بالمشروع
        # ملاحظة: في جانجو العلاقة العكسية الافتراضية تكون lowercase model name
        if hasattr(obj, 'solutionstrategy'):
            strat = obj.solutionstrategy
            return {
                "strategy_id": strat.id,
                "suggestions": strat.problems_solutions_list
            }
        return None
