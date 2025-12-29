// components/ui/AlertDialog.jsx
import { useEffect, useRef } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

const AlertDialog = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  confirmText = "موافق",
  cancelText = "إلغاء",
  onConfirm,
  showCancel = false,
}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const typeConfig = {
    info: {
      icon: <FaInfoCircle className="text-blue-500 text-2xl" />,
      bg: "bg-blue-50",
      border: "border-blue-200",
      button: "bg-blue-600 hover:bg-blue-700",
    },
    success: {
      icon: <FaCheckCircle className="text-green-500 text-2xl" />,
      bg: "bg-green-50",
      border: "border-green-200",
      button: "bg-green-600 hover:bg-green-700",
    },
    warning: {
      icon: <FaExclamationTriangle className="text-amber-500 text-2xl" />,
      bg: "bg-amber-50",
      border: "border-amber-200",
      button: "bg-amber-600 hover:bg-amber-700",
    },
    error: {
      icon: <FaExclamationTriangle className="text-red-500 text-2xl" />,
      bg: "bg-red-50",
      border: "border-red-200",
      button: "bg-red-600 hover:bg-red-700",
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* خلفية شبه شفافة */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        style={{ animation: "fadeIn 0.2s ease-out" }}
        onClick={onClose}
      />

      {/* النافذة */}
      <div
        ref={dialogRef}
        className="relative z-50 w-full max-w-md mx-4"
        style={{ animation: "slideUp 0.3s ease-out" }}
      >
        <div
          className={`${config.bg} ${config.border} border rounded-2xl shadow-2xl overflow-hidden`}
        >
          {/* رأس النافذة */}
          <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              {config.icon}
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
            >
              <FaTimes />
            </button>
          </div>

          {/* محتوى النافذة */}
          <div className="p-6 bg-white">
            <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
          </div>

          {/* أزرار النافذة */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end">
            {showCancel && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
              className={`${config.button} text-white px-5 py-2 rounded-lg font-medium transition hover:shadow-md`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      {/* إضافة الأنيميشن inline style */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

// نسخة مبسطة للنوافذ البسيطة
export const showAlert = ({
  title,
  message,
  type = "info",
  duration = 4000,
}) => {
  const event = new CustomEvent("show-alert", {
    detail: { title, message, type, duration },
  });
  window.dispatchEvent(event);
};

export default AlertDialog;
