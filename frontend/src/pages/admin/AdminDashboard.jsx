import { useState } from "react";
import { Link, Outlet } from "react-router-dom"; // تأكد من وجود Outlet للمحتوى الداخلي
import {
  FaUsers,
  FaRocket,
  FaDatabase,
  FaCogs,
  FaSignOutAlt,
  FaSearch,
  FaChartLine,
  FaBars,
  FaBell,
  FaAngleRight,
  FaAngleLeft,
} from "react-icons/fa";
import { useNotifications } from "../../hooks/useNotifications"; // تأكد من المسار الصحيح
import AdminSidebar from "./AdminSidebar";
const AdminDashboard = () => {
  // حالة القائمة الجانبية (للكمبيوتر: مطوية/مفتوحة)
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true); // الافتراضي مطوي (أيقونات فقط)

  // حالة القائمة للجوال (مخفية/ظاهرة)
  const [isMobileOpen, setMobileOpen] = useState(false);

  // استخدام هوك الإشعارات هنا لتمريره للهيدر
  const { notifications, unreadCount, markAsRead } = useNotifications();

  return (
    <div
      className="flex h-screen bg-[#f8f9fc] font-sans overflow-hidden"
      dir="rtl"
    >
      {/* Sidebar Component */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileOpen}
        closeMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100 h-20 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* زر فتح القائمة للجوال */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-navy p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FaBars size={20} />
            </button>

            {/* زر توسيع/طي القائمة للكمبيوتر */}
            <button
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:block text-navy p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {isSidebarCollapsed ? (
                <FaAngleLeft size={20} />
              ) : (
                <FaAngleRight size={20} />
              )}
            </button>

            <h1 className="text-xl font-black text-navy hidden md:block">
              لوحة التحكم
            </h1>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            {/* حقل البحث (كما طلبته سابقاً) */}
            <div className="hidden md:flex items-center bg-gray-50 rounded-full border border-gray-200 px-4 h-10 w-64">
              <FaSearch className="text-gray-400 ml-2" />
              <input
                type="text"
                placeholder="بحث سريع..."
                className="bg-transparent border-none outline-none text-sm text-navy w-full"
              />
            </div>

            {/* Notifications Dropdown (Live Data) */}
            <NotificationsDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              markAsRead={markAsRead}
            />

            {/* Profile */}
            <div className="flex items-center gap-3 border-r border-gray-200 pr-4 mr-2">
              <div className="w-10 h-10 rounded-full bg-navy text-gold flex items-center justify-center font-bold shadow-md border-2 border-white">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content (Outlet allows displaying child routes like /notifications) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-navy/60 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
    </div>
  );
};

// --- مكون القائمة المنسدلة للإشعارات في الهيدر ---
const NotificationsDropdown = ({ notifications, unreadCount, markAsRead }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="relative p-2 text-gray-400 hover:text-navy transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount > 9 ? "+9" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in z-50">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-navy text-sm">
              الإشعارات ({unreadCount})
            </h3>
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs text-gold font-bold hover:underline"
            >
              عرض الكل
            </Link>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center py-6 text-gray-400 text-sm">
                لا توجد إشعارات
              </p>
            ) : (
              notifications.slice(0, 5).map(
                (
                  note // عرض آخر 5 فقط هنا
                ) => (
                  <div
                    key={note.id}
                    onClick={() => markAsRead(note.id)}
                    className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer flex gap-3 ${
                      !note.is_read ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <div
                      className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                        !note.is_read ? "bg-gold" : "bg-gray-300"
                      }`}
                    ></div>
                    <div>
                      <p
                        className={`text-sm leading-tight mb-1 ${
                          !note.is_read
                            ? "font-bold text-navy"
                            : "text-gray-600"
                        }`}
                      >
                        {note.verb || note.title} {/* حسب هيكلة بياناتك */}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(note.timestamp).toLocaleTimeString("ar-EG")}
                      </p>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
