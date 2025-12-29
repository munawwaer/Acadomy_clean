import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useGuestUsage } from "../../hooks/useGuestUsage"; // استدعاء الهوك الجديد
import { FaLock, FaExclamationCircle } from "react-icons/fa";

const AuthGuardButton = ({ children, onClick, className, ...props }) => {
  const { user } = useAuth();
  const { hasRemainingTries, incrementUsage, remainingTries } = useGuestUsage();

  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  const handleClick = (e) => {
    // الحالة 1: المستخدم مسجل دخول -> نفذ فوراً
    if (user) {
      if (onClick) onClick(e);
      return;
    }

    // الحالة 2: زائر ولديه محاولات مجانية -> خصم محاولة ونفذ
    if (hasRemainingTries) {
      incrementUsage(); // زيادة العداد
      if (onClick) onClick(e); // تنفيذ العملية (مثل التحليل)
      // يمكنك هنا إظهار رسالة صغيرة (Toast) تخبره كم تبقى له
      alert(`متبقي لديك ${remainingTries - 1} محاولات مجانية`);
      return;
    }

    // الحالة 3: زائر وانتهت محاولاته -> افتح نافذة التسجيل
    setShowModal(true);
  };

  const handleLoginRedirect = () => {
    navigate("/login", { state: { from: location } });
  };

  return (
    <>
      <button onClick={handleClick} className={className} {...props}>
        {children}
      </button>

      {/* نافذة القفل (عند انتهاء المحاولات) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center border-t-4 border-gold relative">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
              <FaLock />
            </div>

            <h3 className="text-xl font-black text-navy mb-2">
              استنفدت المحاولات المجانية
            </h3>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              لقد قمت بتجربة الأداة 3 مرات. للحصول على تحليل غير محدود وحفظ
              مشاريعك، يرجى إنشاء حساب (مجاناً).
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleLoginRedirect}
                className="w-full py-3 bg-navy text-gold font-bold rounded-xl hover:bg-navy-light transition shadow-lg"
              >
                إنشاء حساب الآن
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2 text-gray-400 hover:text-navy text-sm font-bold"
              >
                لا شكراً
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthGuardButton;
