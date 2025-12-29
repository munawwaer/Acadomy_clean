import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../../api/client";
import {
  FaPlus,
  FaRocket,
  FaUsers,
  FaChartPie,
  FaClock,
  FaStar,
  FaBell,
  FaBrain,
  FaArrowLeft,
  FaMagic,
} from "react-icons/fa";

const DashboardHome = () => {
  const [stats, setStats] = useState({
    total_projects: 0,
    total_leads: 0,
    total_views: 0,
    user_name: "المستخدم",
  });

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, notesRes] = await Promise.all([
          client.get("v1/core/dashboard/stats/"),
          client.get("/v1/notifications/"),
        ]);

        setStats(statsRes.data);
        setNotifications(notesRes.data); // عرض 4 إشعارات بدلاً من 3
      } catch (error) {
        console.log("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-navy border-t-gold rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm animate-pulse">
            جاري تجهيز لوحة القيادة...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 md:p-10 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 1. رأس الصفحة الترحيبي */}
        <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-black text-navy mb-2 flex items-center gap-2">
              صباح الخير، {stats.user_name} <span className="text-2xl">👋</span>
            </h1>
            <p className="text-gray-500 font-medium">
              إليك نظرة عامة على أداء مشاريعك اليوم.
            </p>
          </div>
          <Link
            to="/new-project"
            className="group bg-navy text-white px-6 py-3 rounded-xl font-bold flex items-center gap-3 transition-all hover:bg-navy-light hover:shadow-lg hover:shadow-navy/20"
          >
            <span>مشروع جديد</span>
            <div className="bg-white/20 p-1 rounded-md group-hover:rotate-90 transition-transform">
              <FaPlus size={12} />
            </div>
          </Link>
        </header>

        {/* 2. بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="المشاريع النشطة"
            value={stats.total_projects}
            icon={<FaRocket />}
            color="bg-blue-500"
            subText="مشروع قيد العمل"
          />
          <StatCard
            title="إجمالي المهتمين (Leads)"
            value={stats.total_leads}
            icon={<FaUsers />}
            color="bg-emerald-500"
            subText="عميل محتمل"
          />
          <StatCard
            title="تحليلات النظام"
            value={stats.total_views}
            icon={<FaChartPie />}
            color="bg-purple-500"
            subText="عملية تحليل"
          />
        </div>

        {/* 3. منطقة المحتوى (شبكة) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* اليمين: المشاريع (يأخذ مساحة أكبر) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                  <FaRocket className="text-gold" />
                  مشاريعك الحالية
                </h2>
                {stats.total_projects > 0 && (
                  <Link
                    to="/projects"
                    className="text-sm text-gray-400 hover:text-navy flex items-center gap-1 transition-colors"
                  >
                    عرض الكل <FaArrowLeft size={10} />
                  </Link>
                )}
              </div>

              {stats.total_projects === 0 ? (
                // حالة عدم وجود مشاريع (Empty State)
                <div
                  className="border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center justify-center text-center h-[300px] hover:border-gold/50 transition-colors group cursor-pointer"
                  onClick={() => (window.location.href = "/new-project")}
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4 group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                    <FaMagic size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-700 mb-2">
                    لا توجد مشاريع حتى الآن
                  </h3>
                  <p className="text-gray-400 text-sm max-w-xs mb-6">
                    ابدأ رحلتك بإنشاء مشروعك الأول وسنقوم بمساعدتك في تحليله
                    بالكامل.
                  </p>
                  <span className="text-navy font-bold text-sm border-b-2 border-gold pb-1">
                    ابدأ الآن
                  </span>
                </div>
              ) : (
                // حالة وجود مشاريع (Placeholder)
                <div className="space-y-4">
                  {/* هنا يمكن إضافة قائمة مختصرة للمشاريع لاحقاً */}
                  <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                    لديك {stats.total_projects} مشاريع نشطة. انتقل لصفحة
                    المشاريع للتفاصيل.
                  </div>
                  <Link
                    to="/projects"
                    className="block w-full text-center py-3 border border-gray-200 rounded-xl hover:bg-gray-50 text-navy font-bold transition"
                  >
                    إدارة المشاريع
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* اليسار: آخر النشاطات (Timeline) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-bold text-navy">🔔 آخر التحديثات</h2>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            </div>

            <div className="relative border-r-2 border-gray-100 mr-3 space-y-8 pb-4">
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-400 pr-6 py-4">
                  لا توجد إشعارات جديدة
                </p>
              ) : (
                notifications.map((note, index) => (
                  <TimelineItem
                    key={index}
                    icon={getNotificationIcon(note.data?.event_type)}
                    title={note.title}
                    desc={note.message}
                    time={note.created_at}
                    isLast={index === notifications.length - 1}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- المكونات الفرعية (Sub-components) ---

const StatCard = ({ title, value, icon, color, subText }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div
        className={`w-12 h-12 rounded-xl ${color} bg-opacity-10 flex items-center justify-center text-xl group-hover:bg-opacity-20 transition-all`}
      >
        <span className={`${color.replace("bg-", "text-")}`}>{icon}</span>
      </div>
      {/* مؤشر ارتفاع/انخفاض وهمي للتجميل */}
      {/* <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
        +12% <FaArrowLeft className="rotate-45" size={8}/>
      </span> */}
    </div>
    <h3 className="text-3xl font-black text-navy mb-1">{value}</h3>
    <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
    <p className="text-xs text-gray-300">{subText}</p>
  </div>
);

const TimelineItem = ({ icon, title, desc, time }) => {
  const dateObj = new Date(time);
  const formattedTime = dateObj.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = dateObj.toLocaleDateString("ar-EG");

  return (
    <div className="relative pr-8 group">
      {/* النقطة على الخط */}
      <div className="absolute -right-[9px] top-0 bg-white p-1">
        <div className="w-3 h-3 rounded-full bg-gray-200 border-2 border-white group-hover:bg-gold transition-colors shadow-sm"></div>
      </div>

      {/* المحتوى */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <h4 className="text-sm font-bold text-navy group-hover:text-gold transition-colors">
            {title}
          </h4>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 p-2 rounded-lg border border-gray-100 mb-2">
          {desc}
        </p>
        <span className="text-[10px] text-gray-300 font-mono flex gap-2">
          <span>{formattedDate}</span>
          <span>•</span>
          <span>{formattedTime}</span>
        </span>
      </div>
    </div>
  );
};

// --- دوال مساعدة ---
const getNotificationIcon = (type) => {
  switch (type) {
    case "FIRST_LEAD":
      return <FaUsers className="text-emerald-500 text-xs" />;
    case "READY_TO_LAUNCH":
      return <FaRocket className="text-gold text-xs" />;
    case "STRATEGY_GENERATED":
      return <FaBrain className="text-purple-500 text-xs" />;
    case "WELCOME_USER":
      return <FaStar className="text-yellow-400 text-xs" />;
    default:
      return <FaBell className="text-gray-400 text-xs" />;
  }
};

export default DashboardHome;
