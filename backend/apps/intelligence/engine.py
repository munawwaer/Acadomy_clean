import random

class MarketSpyBot:
    def __init__(self, project_title, description, sector):
        self.title = project_title
        self.desc = description
        self.sector = sector # 'FOOD', 'TECH', 'GENERAL'

    def run(self):
        queries = self._generate_search_queries()
        competitors_raw = self._fetch_competitors_raw() # الآن ستجلب بيانات كثيرة عشوائية
        
        formatted_competitors = []
        
        for comp in competitors_raw:
            structured_problems = self._categorize_problems(comp['raw_reviews'])
            
            formatted_competitors.append({
                "name": comp['name'],
                "url": comp['url'],
                "description": comp['description'],
                "rating": comp['rating'],
                "problems": structured_problems
            })

        return {
            "status": "Success",
            "sector_used": self.sector,
            "competitors_count": len(formatted_competitors), # لنعرف كم واحد جلبنا
            "competitors": formatted_competitors
        }

    # ... (نفس دوال _categorize_problems و _generate_search_queries السابقة تماماً) ...
    def _categorize_problems(self, raw_reviews_list):
        # (ضع هنا نفس كود التصنيف السابق الذي اتفقنا عليه لعدم التكرار)
        tech_issues = []
        financial_issues = []
        service_issues = []

        keywords_money = ['غالي', 'سعر', 'expensive', 'cost', 'money', 'اشتراك']
        keywords_service = ['تأخير', 'سيء', 'rude', 'slow', 'support', 'دعم']
        keywords_tech = ['يعلق', 'بطيء', 'crash', 'bug', 'error', 'شاشة']

        if self.sector == 'FOOD':
            keywords_tech += ['تطبيق التوصيل', 'اللوكيشن']
            keywords_service += ['بارد', 'طعم', 'نظيف', 'ذبابة']
            keywords_money += ['كمية', 'صحن', 'portion'] 
        elif self.sector == 'TECH':
            keywords_tech += ['تحديث', 'ui', 'ux', 'login', 'login error']
            keywords_money += ['premium', 'ads', 'إعلانات']

        for review in raw_reviews_list:
            added = False
            if any(k in review for k in keywords_tech):
                tech_issues.append(review); added = True
            if any(k in review for k in keywords_money):
                financial_issues.append(review); added = True
            if any(k in review for k in keywords_service):
                service_issues.append(review); added = True
            if not added: service_issues.append(review)

        return {
            "technical": tech_issues if tech_issues else None,
            "financial": financial_issues if financial_issues else None,
            "service": service_issues if service_issues else None
        }

    def _generate_search_queries(self):
        return [f"{self.title} competitors"]

    # ---------------------------------------------------------
    # 🔥 هنا التغيير الكبير: مصنع البيانات العشوائية 🔥
    # ---------------------------------------------------------
    def _fetch_competitors_raw(self):
        sources = {
            'FOOD': self._mock_google_maps_search,
            'TECH': self._mock_app_store_search,
            'GENERAL': self._mock_general_search,
        }
        return sources.get(self.sector, self._mock_general_search)()
    def _generate_random_reviews(self, sector, count=5):
        """توليد تعليقات عشوائية مخلوطة بكلمات مفتاحية"""
        
        # بنك جمل للمطاعم
        food_reviews_pool = [
            "الأكل وصل بارد جداً", "السعر غالي على الفاضي", "طعم الشاورما ممتاز", 
            "تأخر الطلب ساعتين", "المكان غير نظيف وفيه ذباب", "كمية الاكل قليلة جدا",
            "التطبيق حقهم يعلق ما يطلب", "خدمة العملاء سيئة", "أفضل مطعم في العالم",
            "اللوكيشن في الخريطة غلط"
        ]
        
        # بنك جمل للتطبيقات
        tech_reviews_pool = [
            "التطبيق يخرج فجأة crash", "اشتراك الـ premium غالي جدا", "تصميم الواجهة UI سيء",
            "لا استطيع تسجيل الدخول login error", "كثرة الإعلانات ads مزعجة", "تطبيق ممتاز وسريع",
            "الدعم الفني لا يرد support", "بعد التحديث الأخير صار بطيء", "يعلق عند الدفع",
            "فكرة حلوة بس التطبيق مليان bugs"
        ]

        # اختيار القائمة المناسبة
        pool = food_reviews_pool if sector == 'FOOD' else tech_reviews_pool
        
        # إرجاع عدد عشوائي من التعليقات (مثلاً بين 3 و 8 تعليقات لكل منافس)
        return [random.choice(pool) for _ in range(random.randint(3, 8))]

    def _mock_google_maps_search(self):
        # توليد بين 5 إلى 10 منافسين وهميين
        competitors = []
        prefixes = ["مطعم", "كافيه", "بوفية", "مطبخ"]
        names = ["الذواق", "السريع", "الذهبي", "الشعبي", "البركة", "العميد", "سلطان"]
        
        for i in range(random.randint(5, 10)): # عدد المنافسين
            name = f"{random.choice(prefixes)} {random.choice(names)} {random.randint(1,99)}"
            competitors.append({
                "name": name,
                "url": f"http://maps.google.com/?q={i}",
                "description": "مطعم يقدم وجبات متنوعة",
                "rating": round(random.uniform(1.5, 4.9), 1), # تقييم عشوائي مثل 3.4
                "raw_reviews": self._generate_random_reviews('FOOD')
            })
        return competitors

    def _mock_app_store_search(self):
        competitors = []
        names_part1 = ["Super", "Easy", "Fast", "Smart", "Pro", "Go"]
        names_part2 = ["App", "Chat", "Task", "Pay", "Food", "Tech"]
        
        for i in range(random.randint(5, 10)):
            name = f"{random.choice(names_part1)}{random.choice(names_part2)}"
            competitors.append({
                "name": name,
                "url": f"http://play.google.com/store/apps/{name.lower()}",
                "description": "Best app for productivity",
                "rating": round(random.uniform(2.0, 5.0), 1),
                "raw_reviews": self._generate_random_reviews('TECH')
            })
        return competitors

    def _mock_general_search(self):
        # للمنافسين العامين
        competitors = []
        for i in range(5):
            competitors.append({
                "name": f"Competitor General {i}",
                "url": "http://example.com",
                "description": "General service provider",
                "rating": 3.0,
                "raw_reviews": ["خدمة سيئة", "سعر مقبول", "لا يوجد دعم"]
            })
        return competitors