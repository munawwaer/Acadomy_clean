from django.apps import AppConfig


class IncubationConfig(AppConfig):
    name = 'incubation'



# from django.db import models
# from django.conf import settings
# from django.utils.translation import gettext_lazy as _
# from core.models import BaseModel # نفترض أن كودك السابق موجود في تطبيق اسمه core

# # ==========================================
# # الكتلة 1: نواة المشروع (The Core)
# # ==========================================

# class Project(BaseModel):
#     """
#     هذا هو 'الملف الرئيسي' للفكرة. 
#     يحتوي على الحالة العامة والبيانات الأساسية فقط.
#     """
    
#     # 1. نظام تتبع المراحل (GPS المشروع)
#     # هذا يحدد أين يقف المستخدم الآن، ويمنعه من القفز لمراحل متقدمة قبل إنهاء السابقة
#     class Stage(models.TextChoices):
#         IDEA = 'IDEA', _('فكرة جديدة')                 # البداية
#         RESEARCHING = 'RESEARCHING', _('جاري البحث')   # البوت يعمل الآن
#         ANALYZED = 'ANALYZED', _('تم التحليل')         # البوت انتهى ووجد مشاكل/منافسين
#         STRATEGY_SET = 'STRATEGY_SET', _('تم وضع الحل')# المستخدم كتب الحل بيده
#         LANDING_PAGE = 'LANDING_PAGE', _('صفحة الهبوط')# الصفحة مبنية
#         PUBLISHED = 'PUBLISHED', _('منشور')            # الصفحة متاحة للناس
#         VALIDATED = 'VALIDATED', _('تم التحقق')        # وصل للهدف (مثلاً 100 مشترك)

#     # المالك (يمكن أن يكون فارغاً مؤقتاً للزوار، ثم نربطه عند التسجيل)
#     owner = models.ForeignKey(
#         settings.AUTH_USER_MODEL, 
#         on_delete=models.CASCADE, 
#         related_name='projects',
#         null=True, blank=True
#     )

#     # البيانات الأساسية
#     title = models.CharField(max_length=255, help_text="اسم المشروع المقترح")
    
#     # الوصف الخام: نحتفظ به لنقارن لاحقاً كيف تطورت الفكرة بعد البحث
#     raw_description = models.TextField(help_text="شرح الفكرة كما كتبها المستخدم أول مرة")
    
#     # القطاع: مهم جداً لتوجيه البوت (مثلاً لو قطاع 'مطاعم' يبحث في خرائط جوجل، لو 'تطبيقات' يبحث في AppStore)
#     target_sector = models.CharField(max_length=100, blank=True, help_text="تقنية، تجارة، تعليم...")

#     # التحكم
#     stage = models.CharField(max_length=20, choices=Stage.choices, default=Stage.IDEA)
    
#     # حقل المستقبل: نخزن فيه أي إعدادات إضافية قد نحتاجها لاحقاً دون تعديل الجدول
#     # مثال: {"allow_notifications": true, "theme": "dark"}
#     settings = models.JSONField(default=dict, blank=True)

#     def __str__(self):
#         return f"{self.title} ({self.get_stage_display()})"


# # ==========================================
# # الكتلة 2: الرادار (البحث والبيانات الخام)
# # ==========================================

# class ResearchReport(BaseModel):
#     """
#     هنا نخزن "فوضى" البيانات التي جلبها البوت من الإنترنت.
#     استخدمنا JSON لأن بيانات المنافسين تختلف من موقع لآخر.
#     """
#     project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='research_report')
    
#     # البيانات الخام للمنافسين (نخزن كل شيء نجده)
#     # Structure: [{"name": "Uber", "url": "...", "rating": 4.5, "found_complaints": ["slow", "expensive"]}]
#     competitors_data = models.JSONField(default=list, blank=True, help_text="بيانات المنافسين الخام من الويب")
    
#     # ملخص المشاكل (Extract): البوت يستخرج أهم 5 مشاكل ويضعها هنا ليسهل عرضها للمستخدم
#     # مثال: ["خدمة عملاء سيئة", "السعر غالي", "التطبيق يعلق"]
#     detected_problems = models.JSONField(default=list, blank=True, help_text="المشاكل المستخلصة ليختار المستخدم منها")
    
#     # المصادر الخارجية التي نقترحها على المستخدم (الواجب المنزلي)
#     # مثال: ["Check Reddit r/startups", "Look at ProductHunt"]
#     suggested_homework_sources = models.JSONField(default=list, blank=True)

#     def __str__(self):
#         return f"Report for {self.project.title}"


# # ==========================================
# # الكتلة 3: العقل (الاستراتيجية والحل)
# # ==========================================

# class SolutionStrategy(BaseModel):
#     """
    
#     هذا الجدول هو 'الجسر'.
#     يربط المشكلة (من البحث) بالحل (من المستخدم) بالعنوان (لصفحة الهبوط).
#     """
#     project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='strategy')
    
#     # 1. المشكلة المختارة: المستخدم يختار واحدة من المشاكل التي وجدها البوت
#     target_problem = models.CharField(max_length=255, help_text="المشكلة التي قرر المستخدم حلها")
    
#     # 2. الحل المقترح: المستخدم يكتب كيف سيحلها (هنا الالتزام Commitment)
#     proposed_solution = models.TextField(help_text="كيف سيحل المستخدم هذه المشكلة؟")
    
#     # 3. الميزة التنافسية (توليد تلقائي أو يدوي): ستصبح العنوان الرئيسي في الصفحة
#     # مثال: "توصيل في 15 دقيقة" (بناءً على مشكلة التأخير)
#     generated_headline = models.CharField(max_length=255, help_text="العنوان التسويقي لصفحة الهبوط")
    
#     def __str__(self):
#         return f"Strategy: Solving {self.target_problem}"


# # ==========================================
# # الكتلة 4: الواجهة (صفحة الهبوط والاختبار)
# # ==========================================

# class LandingPage(BaseModel):
#     """
#     الصفحة النهائية التي يراها الناس.
#     """
#     project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='landing_page')
    
#     # الرابط: kikstra.com/p/my-super-idea
#     slug = models.SlugField(unique=True, max_length=100)
    
#     # المحتوى (يأتي تلقائياً من جدول الاستراتيجية، ويمكن تعديله)
#     main_headline = models.CharField(max_length=255)
#     sub_headline = models.TextField(blank=True)
    
#     # الوسائط (كما طلبت: صور وفيديو لإقناع الزوار)
#     hero_image = models.ImageField(upload_to='landing_hero/', null=True, blank=True)
#     video_url = models.URLField(null=True, blank=True, help_text="رابط فيديو يوتيوب")
    
#     # التلعيب (Gamification): الهدف المطلوب للانتقال للمرحلة التالية
#     target_signups_goal = models.IntegerField(default=100, help_text="الهدف: كم مشترك لفتح التمويل؟")
#     current_signups = models.IntegerField(default=0)
    
#     # الحالة
#     is_published = models.BooleanField(default=False)
    
#     # التصميم (نخزن الألوان هنا لسهولة التغيير من الفرونت إند)
#     theme_config = models.JSONField(default=dict, help_text="{'primary_color': '#FF0000', 'font': 'Cairo'}")

#     def __str__(self):
#         return self.slug


# # ==========================================
# # الكتلة 5: الجمهور (الأسئلة والردود)
# # ==========================================

# class PageQuestion(BaseModel):
#     """
#     الأسئلة المخصصة التي يضعها صاحب المشروع في صفحته.
#     مثال: "ما هو أكثر شيء يزعجك في التطبيقات الحالية؟"
#     """
#     class FieldType(models.TextChoices):
#         TEXT = 'TEXT', 'نص قصير'
#         CHOICE = 'CHOICE', 'اختيارات متعددة'

#     landing_page = models.ForeignKey(LandingPage, on_delete=models.CASCADE, related_name='questions')
    
#     question_text = models.CharField(max_length=255)
#     field_type = models.CharField(max_length=20, choices=FieldType.choices, default=FieldType.TEXT)
    
#     # خيارات الإجابة (إذا كان نوع السؤال اختيارات)
#     options = models.JSONField(default=list, blank=True, null=True, help_text="['نعم', 'لا'] if choice")
    
#     order = models.IntegerField(default=0, help_text="ترتيب السؤال في الصفحة")

#     def __str__(self):
#         return self.question_text


# class ProjectLead(BaseModel):
#     """
#     الأشخاص الذين سجلوا اهتمامهم (العملاء المحتملين).
#     """
#     landing_page = models.ForeignKey(LandingPage, on_delete=models.CASCADE, related_name='leads')
    
#     email = models.EmailField()
#     name = models.CharField(max_length=100, blank=True, null=True)
    
#     # نخزن إجاباتهم على الأسئلة هنا كـ JSON لتجنب تعقيد الجداول
#     # Structure: {"question_id_1": "Answer text", "question_id_2": "Selected Option"}
#     answers_data = models.JSONField(default=dict, blank=True)

#     class Meta:
#         # يمنع الشخص من التسجيل مرتين في نفس المشروع
#         unique_together = ('landing_page', 'email') 

#     def __str__(self):
#         return self.email