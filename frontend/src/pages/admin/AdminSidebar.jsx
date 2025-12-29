import {
  FaChartLine,
  FaUsers,
  FaRocket,
  FaDatabase,
  FaCogs,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = ({
  isCollapsed,
  isMobileOpen,
  closeMobile,
}) => {
  return (
    <aside
      className={`
          fixed md:static top-0 right-0 h-full bg-navy text-white z-30 shadow-2xl
          transform transition-all duration-300 ease-in-out border-l border-white/5 flex flex-col
          ${
            isMobileOpen
              ? "translate-x-0 w-64"
              : "translate-x-full md:translate-x-0"
          } 
          ${isCollapsed ? "md:w-20" : "md:w-64"} 
        `}
    >
      {/* Header Logo */}
      <div className="h-20 flex items-center justify-center border-b border-white/10 bg-navy-dark relative">
        {isCollapsed && !isMobileOpen ? (
          <span className="text-3xl font-black text-gold">A</span>
        ) : (
          <h2 className="text-2xl font-black text-gold tracking-widest fade-in">
            ADMIN
          </h2>
        )}

        {/* زر إغلاق للجوال فقط */}
        <button
          onClick={closeMobile}
          className="md:hidden absolute left-4 text-white/50 hover:text-white"
        >
          <FaTimes size={20} />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto overflow-x-hidden">
        <SidebarItem
          to="/"
          icon={<FaChartLine />}
          label="الرئيسية"
          collapsed={isCollapsed}
        />
        <SidebarItem
          to="/notifications" // رابط صفحة الاشعارات الجديدة
          icon={<FaUsers />} // يمكنك تغيير الأيقونة
          label="الإشعارات"
          collapsed={isCollapsed}
        />
        <SidebarItem
          to="/projects"
          icon={<FaRocket />}
          label="المشاريع"
          collapsed={isCollapsed}
        />
        <SidebarItem
          to="/users"
          icon={<FaUsers />}
          label="المستخدمين"
          collapsed={isCollapsed}
        />

        <div className="my-4 border-t border-white/10"></div>

        <SidebarItem
          to="/settings"
          icon={<FaCogs />}
          label="الإعدادات"
          collapsed={isCollapsed}
        />
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 bg-[#050e1c]">
        <button
          className={`flex items-center gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full p-3 rounded-xl transition-all duration-300 font-bold text-sm ${
            isCollapsed ? "justify-center" : ""
          }`}
          title="تسجيل خروج"
        >
          <FaSignOutAlt size={20} />
          {(!isCollapsed || isMobileOpen) && (
            <span className="whitespace-nowrap fade-in">خروج</span>
          )}
        </button>
      </div>
    </aside>
  );
};

// مكون عنصر القائمة الفردي
const SidebarItem = ({ icon, label, to, collapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`
            flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer transition-all duration-300 group relative
            ${
              isActive
                ? "bg-gold text-navy font-bold shadow-lg shadow-gold/20"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            }
            ${collapsed ? "justify-center" : ""}
        `}
    >
      <div
        className={`text-xl shrink-0 transition-transform duration-300 ${
          isActive ? "" : "group-hover:scale-110"
        }`}
      >
        {icon}
      </div>

      {/* النص يظهر ويختفي بناء على حالة الطي */}
      {!collapsed && (
        <span className="whitespace-nowrap overflow-hidden fade-in">
          {label}
        </span>
      )}

      {/* Tooltip عند الطي فقط */}
      {collapsed && (
        <div className="absolute right-full mr-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
          {label}
        </div>
      )}
    </Link>
  );
};

export default AdminSidebar;
