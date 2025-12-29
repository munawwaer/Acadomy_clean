import { useState, useEffect, useCallback } from "react";
import client from "../api/client";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // دالة جلب الإشعارات
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await client.get("/v1/notifications/");
      setNotifications(res.data);
      // حساب غير المقروءة
      const count = res.data.filter((n) => !n.is_read).length;
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // دالة تحديد الكل كمقروء
  const markAllAsRead = async () => {
    try {
      await client.post("/v1/notifications/mark_all_read/");
      // تحديث الحالة محلياً لتوفير طلب جديد
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all read", error);
    }
  };

  // دالة تحديد إشعار واحد كمقروء
  const markAsRead = async (id) => {
    try {
      await client.post(`/v1/notifications/${id}/mark_read/`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking read", error);
    }
  };

  // تشغيل الجلب عند التحميل
  useEffect(() => {
    fetchNotifications();

    // يمكن تفعيل polling كل دقيقة للتحديث التلقائي
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    markAllAsRead,
    markAsRead,
    refresh: fetchNotifications,
  };
};
