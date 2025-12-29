import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaArrowLeft,
  FaRocket,
  FaLightbulb,
  FaChartLine,
  FaBars,
  FaTimes,
  FaStar,
} from "react-icons/fa";

// --- 1. بيانات وهمية (سهل استبدالها ببيانات قاعدة البيانات لاحقاً) ---
const MOCK_PROJECTS = [
  {
    id: 1,
    title: "تطبيق توصيل قهوة",
    category: "TECH",
    description:
      "منصة تربط عشاق القهوة بأقرب المقاهي المختصة مع ميزة الاشتراك الشهري.",
    author: "أحمد محمد",
    status: "تحت الدراسة",
    likes: 120,
  },
  {
    id: 2,
    title: "مطعم سحابي صحي",
    category: "FOOD",
    description: "سلسلة مطابخ سحابية تقدم وجبات كيتو دايت بأسعار منافسة.",
    author: "سارة علي",
    status: "مرحلة التخطيط",
    likes: 85,
  },
  {
    id: 3,
    title: "منصة عقار ذكية",
    category: "REAL_ESTATE",
    description:
      "استخدام الذكاء الاصطناعي لتقييم أسعار العقارات في الأحياء الجديدة.",
    author: "خالد عمر",
    status: "جاهز للإطلاق",
    likes: 230,
  },
  {
    id: 4,
    title: "إعادة تدوير البلاستيك",
    category: "OTHER",
    description: "مشروع بيئي يهدف لتحويل نفايات البلاستيك إلى مواد بناء.",
    author: "نورة سعد",
    status: "فكرة",
    likes: 45,
  },
];

const PublicDashboardHome = () => {
  // --- States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // تصفية المشاريع بناءً على البحث والتصنيف
  const filteredProjects = MOCK_PROJECTS.filter((project) => {
    const matchesSearch =
      project.title.includes(searchTerm) ||
      project.description.includes(searchTerm);
    const matchesCategory =
      selectedCategory === "ALL" || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  useEffect(() => {
    //    client.get('/public/projects').then(res => setProjects(res.data));
  }, []);

  return (
    <div
      dir="rtl"
      className="font-sans text-navy bg-gray-50 min-h-screen flex flex-col"
    >
      {/* =======================
          1. الهيدر (Navbar)
         ======================= */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          {/* الشعار */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-navy text-gold rounded-lg flex items-center justify-center font-black text-xl">
              A
            </div>
            <span className="text-xl font-bold text-navy hidden md:block">
              أكاديمية تأهيل الأفكار
            </span>
          </div>

          {/* روابط التنقل (للكبيوتر) */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
            <Link to="/" className="text-navy hover:text-gold transition">
              الرئيسية
            </Link>
            <a href="#projects" className="hover:text-navy transition">
              تصفح المشاريع
            </a>
            <a href="#services" className="hover:text-navy transition">
              خدماتنا
            </a>
          </div>

          {/* الأزرار */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-navy font-bold hover:text-gold transition text-sm"
            >
              تسجيل الدخول
            </Link>
            <Link
              to="/new-project"
              className="px-6 py-2.5 bg-navy text-white rounded-lg font-bold text-sm hover:bg-navy-light transition shadow-lg shadow-navy/20"
            >
              ابدأ مشروعك
            </Link>
          </div>

          {/* زر الموبايل */}
          <button
            className="md:hidden text-navy p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* قائمة الموبايل المنسدلة */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-lg animate-fade-in">
            <Link to="/" className="block text-navy font-bold">
              الرئيسية
            </Link>
            <a href="#projects" className="block text-gray-600">
              تصفح المشاريع
            </a>
            <hr />
            <Link to="/login" className="block text-navy font-bold">
              تسجيل الدخول
            </Link>
            <Link to="/new-project" className="block text-gold font-bold">
              مشروع جديد
            </Link>
          </div>
        )}
      </nav>

      {/* =======================
          2. قسم الهيرو (Hero)
         ======================= */}
      <section className="relative bg-navy text-white py-20 lg:py-28 overflow-hidden">
        {/* خلفيات جمالية */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            حول فكرتك إلى <span className="text-gold">واقع ملموس</span>
          </h1>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            المنصة المتكاملة لرواد الأعمال: من تحليل الفكرة، بناء الاستراتيجية،
            وحتى دراسة السوق والمنافسين.
          </p>

          {/* شريط البحث الرئيسي */}
          <div className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl">
              <FaSearch className="text-gray-400 ml-3" />
              <input
                type="text"
                placeholder="ابحث عن فكرة، مشروع، أو قطاع..."
                className="w-full bg-transparent py-4 outline-none text-navy placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-gold text-navy font-bold px-8 py-4 md:py-0 rounded-xl hover:bg-yellow-400 transition flex items-center justify-center gap-2">
              بحث <FaArrowLeft className="rotate-0 md:rotate-180" />{" "}
              {/* تدوير السهم ليتناسب مع العربية */}
            </button>
          </div>
        </div>
      </section>

      {/* =======================
          3. قسم تصفح المشاريع
         ======================= */}
      <section id="projects" className="py-16 container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black text-navy mb-2 flex items-center gap-2">
              <FaRocket className="text-gold" /> أحدث المشاريع
            </h2>
            <p className="text-gray-500">
              استكشف الأفكار الريادية التي يتم بناؤها الآن
            </p>
          </div>

          {/* فلاتر التصنيف */}
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {["ALL", "TECH", "FOOD", "REAL_ESTATE"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition border ${
                  selectedCategory === cat
                    ? "bg-navy text-white border-navy"
                    : "bg-white text-gray-500 border-gray-200 hover:border-navy"
                }`}
              >
                {cat === "ALL" ? "الكل" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* شبكة المشاريع */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-400 font-bold">
                لا توجد نتائج تطابق بحثك
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("ALL");
                }}
                className="text-gold text-sm underline mt-2"
              >
                إعادة تعيين الفلاتر
              </button>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/projects"
            className="inline-block px-8 py-3 border-2 border-navy text-navy font-bold rounded-xl hover:bg-navy hover:text-white transition"
          >
            عرض كل المشاريع
          </Link>
        </div>
      </section>

      {/* =======================
          4. قسم الخدمات (لماذا نحن؟)
         ======================= */}
      <section
        id="services"
        className="bg-white py-20 border-t border-gray-100"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-navy mb-4">
              لماذا تختار منصتنا؟
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              نوفر لك الأدوات التي يحتاجها كل رائد أعمال لتحويل فكرته إلى مشروع
              ناجح، مدعومة بالذكاء الاصطناعي.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              icon={<FaLightbulb />}
              title="تحليل عميق للفكرة"
              desc="خوارزميات ذكية تقيم نقاط القوة والضعف في فكرتك وتعطيك تقريراً شاملاً."
            />
            <ServiceCard
              icon={<FaChartLine />}
              title="دراسة السوق"
              desc="بيانات حقيقية عن المنافسين وحجم السوق المستهدف لمشروعك."
            />
            <ServiceCard
              icon={<FaRocket />}
              title="خطة تنفيذية"
              desc="نحول الاستراتيجيات إلى مهام يومية وخطوات عملية قابلة للتطبيق."
            />
          </div>
        </div>
      </section>

      {/* =======================
          5. الفوتر (Footer)
         ======================= */}
      <footer className="bg-navy text-white py-12 border-t border-white/10 mt-auto">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-right">
          <div>
            <h3 className="text-gold font-black text-xl mb-4">
              أكاديمية تأهيل الأفكار
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              المنصة الأولى عربياً لدعم رواد الأعمال في مراحل التأسيس الأولى
              باستخدام أحدث التقنيات.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/" className="hover:text-gold">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-gold">
                  تصفح المشاريع
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-gold">
                  دخول الأعضاء
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">تواصل معنا</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>info@ideas-academy.com</li>
              <li>+966 50 000 0000</li>
              <li>الرياض، المملكة العربية السعودية</li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <Link
              to="/register"
              className="block w-full py-3 bg-gold text-navy font-bold rounded-xl hover:bg-yellow-400 transition text-center"
            >
              انضم إلينا مجاناً
            </Link>
          </div>
        </div>
        <div className="text-center text-gray-600 text-xs mt-10 border-t border-white/5 pt-6">
          © 2025 جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
};

// --- المكونات الفرعية ---

// بطاقة المشروع
const ProjectCard = ({ project }) => (
  <Link to={`/project/${project.id}`} className="block group">
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gold/30 transition-all duration-300 h-full flex flex-col">
      {/* صورة وهمية (Gradient) */}
      <div className="h-48 bg-gradient-to-br from-navy to-blue-900 relative p-4 flex items-end">
        <span className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-bold border border-white/10">
          {project.category}
        </span>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-navy group-hover:text-gold transition-colors line-clamp-1">
            {project.title}
          </h3>
          <div className="flex items-center gap-1 text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
            <FaStar className="text-yellow-400" /> {project.likes}
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-50">
          <span className="text-xs text-gray-400 font-bold flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>{" "}
            {project.author}
          </span>
          <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">
            {project.status}
          </span>
        </div>
      </div>
    </div>
  </Link>
);

// بطاقة الخدمة
const ServiceCard = ({ icon, title, desc }) => (
  <div className="bg-gray-50 p-8 rounded-2xl hover:bg-white hover:shadow-lg transition border border-transparent hover:border-gray-100 text-center">
    <div className="w-16 h-16 bg-navy text-gold rounded-full flex items-center justify-center text-2xl mx-auto mb-6 shadow-lg shadow-navy/20">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-navy mb-3">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default PublicDashboardHome;
