import {
  FaCheckDouble,
  FaTrash,
  FaBell,
  FaEnvelopeOpenText,
  FaCheck,
} from "react-icons/fa";
import { useNotifications } from "../../hooks/useNotifications"; // نفس الهوك

const AdminNotifications = () => {
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    loading,
    refresh,
  } = useNotifications();

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy flex items-center gap-2">
            <FaBell className="text-gold" /> مركز الإشعارات
          </h1>
          <p className="text-gray-500 mt-1">
            إدارة وتنبيهات النظام والنشاطات الحديثة
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={refresh}
            className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-bold text-sm transition"
          >
            تحديث
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-light shadow-lg shadow-navy/20 font-bold text-sm transition"
            >
              <FaCheckDouble /> تحديد الكل كمقروء
            </button>
          )}
        </div>
      </div>

      {/* قائمة الإشعارات */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-navy border-t-gold rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">جاري جلب الإشعارات...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-8">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
              <FaBell size={30} />
            </div>
            <h3 className="text-lg font-bold text-navy">لا توجد إشعارات</h3>
            <p className="text-gray-400">
              أنت مطلع على كل شيء! لا توجد تنبيهات جديدة.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map((note) => (
              <div
                key={note.id}
                className={`p-6 flex gap-4 transition-colors hover:bg-gray-50 group ${
                  !note.is_read ? "bg-blue-50/40" : ""
                }`}
              >
                {/* الأيقونة */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 
                            ${
                              !note.is_read
                                ? "bg-navy text-gold"
                                : "bg-gray-100 text-gray-400"
                            }`}
                >
                  {!note.is_read ? <FaEnvelopeOpenText /> : <FaCheck />}
                </div>

                {/* المحتوى */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4
                      className={`text-base ${
                        !note.is_read
                          ? "font-black text-navy"
                          : "font-bold text-gray-600"
                      }`}
                    >
                      {note.verb || "إشعار جديد"} {/* العنوان */}
                    </h4>
                    <span className="text-xs text-gray-400 whitespace-nowrap font-mono">
                      {new Date(note.timestamp).toLocaleString("ar-EG")}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-3">
                    {note.description || "لا يوجد وصف إضافي لهذا الإشعار."}
                  </p>

                  {/* أزرار الإجراءات */}
                  {!note.is_read && (
                    <button
                      onClick={() => markAsRead(note.id)}
                      className="text-xs font-bold text-gold hover:text-navy flex items-center gap-1 transition"
                    >
                      <FaCheck size={10} /> تحديد كمقروء
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
