import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications"; // 👈 استيراد الـ Hook الجديد
import {
  FaRocket,
  FaSignOutAlt,
  FaUser,
  FaHome,
  FaBell,
  FaMoon,
  FaSun,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaStar,
  FaGem,
  FaServer,
  FaShieldAlt,
} from "react-icons/fa";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // استخدام الـ Hook للبيانات الحقيقية
  const { notifications, unreadCount, markAllAsRead, markAsRead } =
    useNotifications();

  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // دالة مساعدة لاختيار الأيقونة واللون حسب نوع الحدث (من الباك اند)
  const getNotificationStyle = (type) => {
    switch (type) {
      case "STRATEGY_GENERATED":
        return { icon: <FaRocket />, color: "bg-purple-500" };
      case "AI_NEEDS_INFO":
        return { icon: <FaExclamationTriangle />, color: "bg-orange-500" };
      case "FIRST_LEAD":
        return { icon: <FaStar />, color: "bg-yellow-400" }; // نجمة لأول مشترك
      case "READY_TO_LAUNCH":
        return { icon: <FaRocket />, color: "bg-green-500" };
      case "HIGH_POTENTIAL_PROJECT":
        return { icon: <FaGem />, color: "bg-blue-500" };
      case "SUSPICIOUS_CONTENT":
        return { icon: <FaShieldAlt />, color: "bg-red-600" };
      case "SYSTEM_ALERT":
        return { icon: <FaServer />, color: "bg-red-500" };
      default:
        return { icon: <FaBell />, color: "bg-gray-400" };
    }
  };

  // التعامل مع النقر على الإشعار
  const handleNotificationClick = (notif) => {
    if (!notif.is_read) markAsRead(notif.id);
    if (notif.action_url) navigate(notif.action_url);
  };

  return (
    <div
      className={`min-h-screen font-sans direction-rtl flex flex-col ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* Navbar */}
      <nav className="bg-navy text-white shadow-md sticky top-0 z-50 h-16 flex-shrink-0">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* الجهة اليمنى */}
            <div className="flex items-center gap-8">
              <div
                className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
                onClick={() => navigate("/")}
              >
                <div className="bg-gold p-1.5 rounded-lg text-navy-dark shadow-lg shadow-gold/20">
                  <FaRocket size={18} />
                </div>
                <span className="font-black text-xl tracking-wide text-white">
                  اكاديمية <span className="text-gold">تاهيل </span>الأفكار 
                </span>
              </div>

              <div className="hidden md:flex items-center gap-1">
                <NavLink
                  to="/projects"
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${
                      isActive
                        ? "bg-white/10 text-gold shadow-sm"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <FaHome size={14} /> مشاريعي
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${
                      isActive
                        ? "bg-white/10 text-gold shadow-sm"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <FaUser size={14} /> ملفي
                </NavLink>
              </div>
            </div>

            {/* الجهة اليسرى */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full text-gray-300 hover:text-gold hover:bg-white/10 transition"
              >
                {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
              </button>

              {/* زر الإشعارات الحقيقي */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2 rounded-full transition relative ${
                    showNotifications
                      ? "bg-white/10 text-gold"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <FaBell size={18} />
                  {/* الشارة الحمراء تظهر فقط إذا كان هناك غير مقروء */}
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-navy">
                      {unreadCount > 9 ? "+9" : unreadCount}
                    </span>
                  )}
                </button>

                {/* القائمة المنسدلة */}
                {showNotifications && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowNotifications(false)}
                    ></div>
                    <div className="absolute left-0 mt-3 w-80 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in origin-top-left">
                      <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h4 className="font-bold text-sm text-navy">
                          الإشعارات
                        </h4>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-[10px] text-blue-600 hover:underline"
                          >
                            تحديد الكل كمقروء
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto scrollbar-thin">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-400 text-sm">
                            لا توجد إشعارات جديدة 💤
                          </div>
                        ) : (
                          notifications.map((notif) => {
                            const style = getNotificationStyle(
                              notif.event_type
                            );
                            return (
                              <div
                                key={notif.id}
                                onClick={() => handleNotificationClick(notif)}
                                className={`p-3 border-b border-gray-50 hover:bg-blue-50/50 transition cursor-pointer flex gap-3 items-start ${
                                  !notif.is_read ? "bg-blue-50/30" : ""
                                }`}
                              >
                                <div
                                  className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs shadow-sm ${style.color}`}
                                >
                                  {style.icon}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <p
                                      className={`text-xs leading-relaxed ${
                                        !notif.is_read
                                          ? "font-bold text-navy"
                                          : "text-gray-600"
                                      }`}
                                    >
                                      {notif.title}
                                    </p>
                                    {!notif.is_read && (
                                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                                    {notif.message}
                                  </p>
                                  <p className="text-[10px] text-gray-400 mt-1">
                                    {new Date(notif.created_at).toLocaleString(
                                      "ar-EG"
                                    )}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="h-6 w-px bg-white/20 mx-1 hidden sm:block"></div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end leading-tight">
                  <span className="text-sm font-bold text-white">
                    {user?.full_name?.split(" ")[0]}
                  </span>
                  <span className="text-[10px] text-gold font-medium uppercase tracking-wider">
                    {user?.plan_tier === "FREE" ? "Free Plan" : "PRO"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-400 transition p-2 hover:bg-white/10 rounded-full"
                >
                  <FaSignOutAlt size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
// import { useState } from "react";
// import { Outlet, NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import {
//   FaRocket,
//   FaSignOutAlt,
//   FaUser,
//   FaHome,
//   FaBell,
//   FaMoon,
//   FaSun,
//   FaCheckCircle,
//   FaInfoCircle,
// } from "react-icons/fa";

// const DashboardLayout = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   // حالات للتحكم بالقوائم
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false); // حالة الوضع الليلي (تجهيز)

//   // بيانات وهمية للإشعارات (للعرض فقط حالياً)
//   const notifications = [
//     {
//       id: 1,
//       text: "سجل عميل جديد في مشروع 'القهوة المختصة'",
//       type: "success",
//       time: "منذ دقيقتين",
//     },
//     {
//       id: 2,
//       text: "تم اكتمال تحليل المنافسين لمشروعك",
//       type: "info",
//       time: "منذ ساعة",
//     },
//     {
//       id: 3,
//       text: "تذكير: قم بنشر صفحة الهبوط",
//       type: "warning",
//       time: "منذ 3 ساعات",
//     },
//   ];

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div
//       className={`min-h-screen font-sans direction-rtl flex flex-col ${
//         isDarkMode ? "bg-gray-900" : "bg-gray-100"
//       }`}
//     >
//       {/* 1. الشريط العلوي العام (Navbar) */}
//       <nav className="bg-navy text-white shadow-md sticky top-0 z-50 h-16 flex-shrink-0">
//         <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-full">
//           <div className="flex justify-between items-center h-full">
//             {/* --- الجهة اليمنى: الشعار والروابط --- */}
//             <div className="flex items-center gap-8">
//               {/* الشعار */}
//               <div
//                 className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
//                 onClick={() => navigate("/dashboard")}
//               >
//                 <div className="bg-gold p-1.5 rounded-lg text-navy-dark shadow-lg shadow-gold/20">
//                   <FaRocket size={18} />
//                 </div>
//                 <span className="font-black text-xl tracking-wide text-white">
//                   الحاضنة<span className="text-gold">الذكية</span>
//                 </span>
//               </div>

//               {/* روابط التنقل */}
//               <div className="hidden md:flex items-center gap-1">
//                 <NavLink
//                   to="/dashboard"
//                   end
//                   className={({ isActive }) =>
//                     `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${
//                       isActive
//                         ? "bg-white/10 text-gold shadow-sm"
//                         : "text-gray-300 hover:bg-white/5 hover:text-white"
//                     }`
//                   }
//                 >
//                   <FaHome size={14} /> مشاريعي
//                 </NavLink>

//                 <NavLink
//                   to="/dashboard/profile"
//                   className={({ isActive }) =>
//                     `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${
//                       isActive
//                         ? "bg-white/10 text-gold shadow-sm"
//                         : "text-gray-300 hover:bg-white/5 hover:text-white"
//                     }`
//                   }
//                 >
//                   <FaUser size={14} /> ملفي
//                 </NavLink>
//               </div>
//             </div>

//             {/* --- الجهة اليسرى: الأدوات والإشعارات --- */}
//             <div className="flex items-center gap-3">
//               {/* 1. زر الثيم (Theme Toggle) */}
//               <button
//                 onClick={() => setIsDarkMode(!isDarkMode)}
//                 className="p-2 rounded-full text-gray-300 hover:text-gold hover:bg-white/10 transition"
//                 title={isDarkMode ? "الوضع النهاري" : "الوضع الليلي"}
//               >
//                 {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
//               </button>

//               {/* 2. زر الإشعارات (Notifications) */}
//               <div className="relative">
//                 <button
//                   onClick={() => setShowNotifications(!showNotifications)}
//                   className={`p-2 rounded-full transition relative ${
//                     showNotifications
//                       ? "bg-white/10 text-gold"
//                       : "text-gray-300 hover:text-white hover:bg-white/10"
//                   }`}
//                 >
//                   <FaBell size={18} />
//                   {/* الشارة الحمراء (Badge) */}
//                   <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-navy"></span>
//                 </button>

//                 {/* القائمة المنسدلة للإشعارات */}
//                 {showNotifications && (
//                   <>
//                     {/* طبقة شفافة لإغلاق القائمة عند النقر خارجها */}
//                     <div
//                       className="fixed inset-0 z-40"
//                       onClick={() => setShowNotifications(false)}
//                     ></div>

//                     <div className="absolute left-0 mt-3 w-80 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in origin-top-left">
//                       <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
//                         <h4 className="font-bold text-sm text-navy">
//                           الإشعارات
//                         </h4>
//                         <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">
//                           3 جديدة
//                         </span>
//                       </div>
//                       <div className="max-h-64 overflow-y-auto">
//                         {notifications.map((notif) => (
//                           <div
//                             key={notif.id}
//                             className="p-3 border-b border-gray-50 hover:bg-blue-50/50 transition cursor-pointer flex gap-3 items-start"
//                           >
//                             <div
//                               className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${
//                                 notif.type === "success"
//                                   ? "bg-green-500"
//                                   : notif.type === "warning"
//                                   ? "bg-orange-500"
//                                   : "bg-blue-500"
//                               }`}
//                             ></div>
//                             <div>
//                               <p className="text-xs font-bold text-gray-700 leading-relaxed">
//                                 {notif.text}
//                               </p>
//                               <p className="text-[10px] text-gray-400 mt-1">
//                                 {notif.time}
//                               </p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                       <div className="p-2 text-center border-t border-gray-100 bg-gray-50">
//                         <button className="text-xs font-bold text-navy hover:underline">
//                           عرض كل الإشعارات
//                         </button>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>

//               <div className="h-6 w-px bg-white/20 mx-1 hidden sm:block"></div>

//               {/* 3. معلومات المستخدم وزر الخروج */}
//               <div className="flex items-center gap-3">
//                 <div className="hidden sm:flex flex-col items-end leading-tight">
//                   <span className="text-sm font-bold text-white">
//                     {user?.full_name?.split(" ")[0]}
//                   </span>
//                   <span className="text-[10px] text-gold font-medium uppercase tracking-wider">
//                     {user?.plan_tier === "FREE" ? "Free Plan" : "PRO"}
//                   </span>
//                 </div>

//                 <button
//                   onClick={handleLogout}
//                   className="text-gray-400 hover:text-red-400 transition p-2 hover:bg-white/10 rounded-full"
//                   title="تسجيل الخروج"
//                 >
//                   <FaSignOutAlt size={18} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* 2. المحتوى الرئيسي */}
//       {/* ملاحظة: جعلنا الـ Outlet يأخذ المساحة المتبقية (flex-1)
//          بدون هوامش رأسية كبيرة لتلتصق التبويبات بالهيدر
//       */}
//       <main className="flex-1 flex flex-col overflow-hidden relative">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default DashboardLayout;
// import { Outlet, NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import {
//   FaRocket,
//   FaSignOutAlt,
//   FaUser,
//   FaHome,
//   FaLayerGroup,
// } from "react-icons/fa";

// const DashboardLayout = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans direction-rtl">
//       {/* 1. الشريط العلوي (Navbar) */}
//       <nav className="bg-navy text-white shadow-lg sticky top-0 z-50 border-b border-navy-dark">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* الشعار والروابط الرئيسية */}
//             <div className="flex items-center gap-8">
//               {/* الشعار */}
//               <div
//                 className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
//                 onClick={() => navigate("/dashboard")}
//               >
//                 <div className="bg-gold p-2 rounded-lg text-navy-dark">
//                   <FaRocket />
//                 </div>
//                 <span className="font-bold text-xl tracking-wide">
//                   الحاضنة الذكية
//                 </span>
//               </div>

//               {/* روابط التنقل (تظهر في الشاشات المتوسطة والكبيرة) */}
//               <div className="hidden md:flex items-center space-x-4 space-x-reverse">
//                 <NavLink
//                   to="/dashboard"
//                   end
//                   className={({ isActive }) =>
//                     `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                       isActive
//                         ? "bg-navy-dark text-gold"
//                         : "text-gray-300 hover:bg-navy-dark hover:text-white"
//                     }`
//                   }
//                 >
//                   <FaHome /> مشاريعي
//                 </NavLink>

//                 <NavLink
//                   to="/dashboard/profile"
//                   className={({ isActive }) =>
//                     `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                       isActive
//                         ? "bg-navy-dark text-gold"
//                         : "text-gray-300 hover:bg-navy-dark hover:text-white"
//                     }`
//                   }
//                 >
//                   <FaUser /> الملف الشخصي
//                 </NavLink>
//               </div>
//             </div>

//             {/* جهة اليسار: معلومات المستخدم وزر الخروج */}
//             <div className="flex items-center gap-4">
//               <div className="hidden sm:flex flex-col items-end">
//                 <span className="text-sm font-bold text-white">
//                   {user?.full_name}
//                 </span>
//                 <span className="text-xs text-gold">{user?.email}</span>
//               </div>

//               <div className="h-8 w-px bg-gray-700 mx-2 hidden sm:block"></div>

//               <button
//                 onClick={handleLogout}
//                 className="text-gray-300 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-navy-dark"
//                 title="تسجيل الخروج"
//               >
//                 <FaSignOutAlt size={20} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* 2. المحتوى الرئيسي */}
//       <main className="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//         {/* Outlet: مكان ظهور الصفحات الداخلية */}
//         <div className="animate-fade-in">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default DashboardLayout;
