// components/ui/AlertProvider.jsx
import { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const handleShowAlert = (e) => {
      setAlert(e.detail);

      // إغلاق التنبيه بعد المدة المحددة
      if (e.detail.duration) {
        setTimeout(() => {
          setAlert(null);
        }, e.detail.duration);
      }
    };

    window.addEventListener("show-alert", handleShowAlert);

    return () => {
      window.removeEventListener("show-alert", handleShowAlert);
    };
  }, []);

  return (
    <>
      {children}

      {/* نافذة التنبيه الرئيسية */}
      {alert && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`p-4 rounded-xl shadow-lg max-w-md border transform transition-all duration-300 ${
              alert.type === "success"
                ? "bg-green-50 border-green-200"
                : alert.type === "error"
                ? "bg-red-50 border-red-200"
                : alert.type === "warning"
                ? "bg-amber-50 border-amber-200"
                : "bg-blue-50 border-blue-200"
            }`}
            style={{
              animation: "slideUp 0.3s ease-out",
              transform: "translateY(0)",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className={`rounded-full p-2 ${
                  alert.type === "success"
                    ? "bg-green-100 text-green-600"
                    : alert.type === "error"
                    ? "bg-red-100 text-red-600"
                    : alert.type === "warning"
                    ? "bg-amber-100 text-amber-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {alert.type === "success" && <FaCheckCircle />}
                {alert.type === "error" && <FaExclamationTriangle />}
                {alert.type === "warning" && <FaExclamationTriangle />}
                {alert.type === "info" && <FaInfoCircle />}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{alert.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
              </div>
              <button
                onClick={() => setAlert(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* إضافة الأنيميشن inline style */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};
