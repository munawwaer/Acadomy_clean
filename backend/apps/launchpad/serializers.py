from rest_framework import serializers
from django.db import transaction
from .models import LandingPage, PageQuestion, ProjectLead

# --- تعريف الثيمات المسموحة للمجاني ---
ALLOWED_FREE_THEMES = [
    {"id": "theme_1", "primary": "#2563EB", "bg": "#FFFFFF"},
    {"id": "theme_2", "primary": "#10B981", "bg": "#F9FAFB"},
    {"id": "theme_3", "primary": "#111827", "bg": "#1F2937"}
]

class PageQuestionSerializer(serializers.ModelSerializer):
    # أضفنا id هنا لكي نستطيع إرساله عند التعديل
    id = serializers.IntegerField(required=False)
    vote_stats = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PageQuestion
        fields = ['id', 'question_text', 'field_type', 'options', 'image_a', 'image_b', 'order', 'vote_stats']

    def get_vote_stats(self, obj):
        # ✅ إصلاح الأداء: الحساب يتم في قاعدة البيانات مباشرة وليس في بايثون
        if obj.field_type == 'IMAGE_VOTE':
            # ملاحظة: هذا يعتمد على أنك تخزن الإجابة كـ JSON. 
            # الطريقة الأسرع هي استخدام تصفية JSON الخاصة بـ Postgres/SQLite
            q_id = str(obj.id)
            
            # نحسب عدد الإجابات التي تحتوي على هذا السؤال وإجابته A
            # ملاحظة: Syntax قد يختلف قليلاً حسب نوع قاعدة البيانات (Postgres أفضل شيء للـ JSON)
            # الحل البسيط والفعال حالياً (بدون تعقيد SQL):
            leads = obj.landing_page.leads.only('answers_data') # نجلب فقط حقل الإجابات لتخفيف الحمل
            count_a = 0
            count_b = 0
            for lead in leads:
                ans = lead.answers_data.get(q_id)
                if ans == 'image_a': count_a += 1
                elif ans == 'image_b': count_b += 1
            return {"image_a": count_a, "image_b": count_b}
        return None

    def validate(self, attrs):
        request = self.context.get('request')
        # التحقق من الباقة للميزات المدفوعة
        if attrs.get('field_type') == 'IMAGE_VOTE':
            if request and (not request.user.is_authenticated or request.user.plan_tier == 'FREE'):
                raise serializers.ValidationError(
                    {"field_type": "ميزة التصويت بالصور متاحة للباقة المدفوعة فقط."}
                )
        return attrs

class LandingPageSerializer(serializers.ModelSerializer):
    questions = PageQuestionSerializer(many=True, required=False)
    full_url = serializers.SerializerMethodField()
    available_themes = serializers.SerializerMethodField()

    class Meta:
        model = LandingPage
        fields = [
            'id', 'slug', 'full_url', 
            'main_headline', 'sub_headline', 
            'project_logo', 'features_list',
            'views_count', 'shares_count', 'current_signups',
            'theme_config', 'available_themes',
            'questions', 'is_published'
        ]
        read_only_fields = ['slug', 'views_count', 'shares_count', 'current_signups', 'full_url', 'available_themes']

    def get_full_url(self, obj):
        return f"https://kikstra.com/p/{obj.slug}"

    def get_available_themes(self, obj):
        return ALLOWED_FREE_THEMES

    def validate(self, attrs):
        # (نفس منطق التحقق من الثيمات الخاص بك - ممتاز)
        request = self.context.get('request')
        if 'theme_config' in attrs and request and request.user.is_authenticated:
            new_theme = attrs['theme_config']
            user_plan = request.user.plan_tier
            
            if user_plan == 'FREE':
                is_allowed = False
                for allowed in ALLOWED_FREE_THEMES:
                    if new_theme.get('id') == allowed['id']:
                        is_allowed = True
                        break
                if not is_allowed:
                    raise serializers.ValidationError({
                        "theme_config": "عذراً، خطتك المجانية تدعم فقط الثيمات الافتراضية."
                    })
        return attrs

    def update(self, instance, validated_data):
        questions_data = validated_data.pop('questions', None)
        
        # تحديث بيانات الصفحة الأساسية
        instance = super().update(instance, validated_data)

        if questions_data is not None:
            user = self.context['request'].user
            if user.plan_tier == 'FREE' and len(questions_data) > 3:
                raise serializers.ValidationError("الخطة المجانية تسمح بـ 3 أسئلة فقط.")

            # ✅ إصلاح الكارثة: التحديث الذكي بدلاً من الحذف الكامل
            with transaction.atomic():
                # 1. نحتفظ بمعرفات الأسئلة القادمة في الطلب
                keep_ids = []
                
                for q_data in questions_data:
                    # إذا كان السؤال لديه ID وموجود مسبقاً -> تحديث
                    if 'id' in q_data and q_data['id']:
                        q_obj = PageQuestion.objects.filter(id=q_data['id'], landing_page=instance).first()
                        if q_obj:
                            for key, value in q_data.items():
                                setattr(q_obj, key, value)
                            q_obj.save()
                            keep_ids.append(q_obj.id)
                        else:
                            # ID مرسل لكنه غير موجود (ربما خطأ)، ننشئه كجديد
                            del q_data['id']
                            new_q = PageQuestion.objects.create(landing_page=instance, **q_data)
                            keep_ids.append(new_q.id)
                    else:
                        # لا يوجد ID -> إنشاء سؤال جديد
                        new_q = PageQuestion.objects.create(landing_page=instance, **q_data)
                        keep_ids.append(new_q.id)

                # 2. نحذف فقط الأسئلة التي لم تعد موجودة في القائمة المرسلة
                # هذا يحافظ على الـ IDs القديمة وعلى إجابات العملاء
                PageQuestion.objects.filter(landing_page=instance).exclude(id__in=keep_ids).delete()

        return instance


class ProjectLeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectLead
        fields = [
            'id', 
            'landing_page', # 👈 هذا الحقل يتوقع استقبال UUID (وهو ما نرسله)
            'name', 
            'email', 
            'answers_data', 
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']
        # 🔥 الإضافة الهامة: جعل الحقول غير الأساسية اختيارية
        extra_kwargs = {
            'name': {'required': False, 'allow_blank': True},
            'answers_data': {'required': False},
            'email': {'required': True} # الإيميل هو المهم
        }
    def validate(self, data):
        email = data.get('email')
        landing_page = data.get('landing_page')
        
        if ProjectLead.objects.filter(landing_page=landing_page, email=email).exists():
            raise serializers.ValidationError({"email": "هذا البريد مسجل بالفعل في هذه القائمة."})
        
        return data    






  