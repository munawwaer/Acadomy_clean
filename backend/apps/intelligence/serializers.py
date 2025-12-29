from rest_framework import serializers
from .models import ResearchReport, SolutionStrategy

class ResearchReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearchReport
        fields = ['competitors_data', 'detected_problems', 'suggested_sources']

class SolutionStrategySerializer(serializers.ModelSerializer):
    class Meta:
        model = SolutionStrategy
        fields = ['project','problems_solutions_list']
        # # العنوان يتولد تلقائياً، فلا داعي لأن يكتبه المستخدم الآن
        # read_only_fields = ['generated_headline']