# intelligence/ai_wrapper.py
from notifications.services import Notify
from notifications.models import NotificationEvent
import google.generativeai as genai
import json
import os
from dotenv import load_dotenv     #dotenv   تحميل من ملف .env
load_dotenv()


GENAI_API_KEY = os.getenv("GEMINI_API_KEY")

class GeminiBrain:
    def __init__(self):
        try:
            genai.configure(api_key=GENAI_API_KEY)
            self.model = genai.GenerativeModel('models/gemini-flash-latest')
            self.is_active = True
        except:
            self.is_active = False
# ai_wrapper.py

    def generate_landing_copy(self, project_title, raw_description, approved_solutions_list):
        """
        توليد محتوى صفحة الهبوط بناءً على الوصف الخام + الحلول التي اعتمدها المستخدم.
        """
        
        # تحويل قائمة الحلول إلى نص مقروء للذكاء الاصطناعي
        # الشكل: المشكلة: ... -> الحل: ...
        solutions_text = "\n".join([
            f"- المشكلة: {item['problem']} -> الحل المعتمد: {item['solution']}" 
            for item in approved_solutions_list
        ])

        prompt = f"""
        أنت كاتب محتوى إعلاني (Copywriter) محترف جداً ومختص في صفحات الهبوط (Landing Pages).
        
        لدينا مشروع بالبيانات التالية:
        1. اسم المشروع: {project_title}
        2. وصف المشروع الخام: {raw_description}
        3. المشاكل التي يحلها والحلول التقنية المعتمدة:
        {solutions_text}

        المطلوب منك:
        قم بإعادة صياغة هذه المعلومات لتخلق محتوى تسويقي جذاب جداً (لا تنسخ الكلام، بل أبدع في صياغته).
        
        المخرجات المطلوبة (JSON فقط):
        1. "suggested_brand_name": اقترح اسماً تجارياً (Brand Name) إبداعياً، قصيراً، وجذاباً يعكس الحلول الذكية (لا يتجاوز كلمتين).

        2. "main_headline": عنوان رئيسي لا يزيد عن 10 كلمات. يجب أن يكون جذاباً (Catchy) ويركز على الفائدة النهائية للعميل.
        3. "sub_headline": عنوان فرعي يشرح فكرة المشروع بوضوح وكيف يحل المشاكل المذكورة أعلاه.
        4. "features": قائمة (Array) تحتوي على 3 ميزات رئيسية مستخلصة من "الحلول المعتمدة". 
           - لكل ميزة ضع "title" (اسم الميزة التسويقي) و "desc" (وصف الميزة وكيف تفيد العميل).

        الرد يجب أن يكون JSON Valid تماماً بهذا الشكل:
        {{
            "suggested_brand_name":"...",
            "main_headline": "...",
            "sub_headline": "...",
            "features": [
                {{"title": "...", "desc": "..."}},
                {{"title": "...", "desc": "..."}},
                {{"title": "...", "desc": "..."}}
            ]
        }}
        """

        try:
            response = self.model.generate_content(prompt)
            clean_text = response.text.replace('```json', '').replace('```', '').strip()
            return json.loads(clean_text)
        except Exception as e:
            print(f"AI Error: {e}")
            Notify.send_to_admins(
            event_type=NotificationEvent.SYSTEM_ALERT,
            context={
                'error_msg': str(e)[:100] # نرسل أول 100 حرف من الخطأ فقط
                },
                icon="server"
            )
            # في حال الخطأ نرجع بيانات افتراضية بسيطة
            return {
                "suggested_brand_name": project_title, # في حال الفشل نرجع الاسم الأصلي
                "main_headline": f"اكتشف {project_title}",
                "sub_headline": raw_description[:100],
                "features": []
            }
  # ai_wrapper.py

    def suggest_solutions_for_problems(self, problems_list, project_title, project_description):
        """
        تأخذ المشاكل + اسم ووصف المشروع لتعطي حلولاً مفصلة خصيصاً له.
        """
        if not self.is_active:
            return [{"problem": p, "solution": f"حل تقني لـ {p}"} for p in problems_list]

        # لاحظ كيف قمنا بحقن معلومات المشروع في الـ Prompt
        prompt = f"""
        أنت مستشار أعمال وخبير منتجات رقمية.
        لدينا مشروع ناشئ بالتفاصيل التالية:
        
        1. اسم المشروع: {project_title}
        2. وصف المشروع: {project_description}
        
        وهذه هي المشاكل التي يواجهها العملاء في هذا السوق حالياً:
        {json.dumps(problems_list, ensure_ascii=False)}

        المطلوب:
        لكل مشكلة، اقترح "حلاً إبداعياً" يتناسب تماماً مع طبيعة هذا المشروع المذكور أعلاه.
        الحل يجب أن يكون قابلاً للتطبيق ضمن المشروع، ومختصراً (أقل من 20 كلمة).

        شكل الرد (JSON Array Only):
        [
            {{"problem": "نص المشكلة", "solution": "الحل المقترح المناسب للمشروع"}}
        ]
        """
        
        try:
            response = self.model.generate_content(prompt)
            clean_text = response.text.replace('```json', '').replace('```', '').strip()
            return json.loads(clean_text)
        except Exception as e:
            print(f"AI Error: {e}")
            Notify.send_to_admins(
            event_type=NotificationEvent.SYSTEM_ALERT,
            context={
                'error_msg': str(e)[:100] # نرسل أول 100 حرف من الخطأ فقط
                },
                icon="server"
            )
            return [{"problem": p, "solution": "نعمل على حلها"} for p in problems_list]




