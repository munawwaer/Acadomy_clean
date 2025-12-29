import { useAuth } from "../../context/AuthContext";
import { FaUserCircle, FaCrown, FaEnvelope } from "react-icons/fa";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto mt-10 animate-fade-in">
      {/* بطاقة المستخدم */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* الغلاف */}
        <div className="h-32 bg-navy relative">
          <div className="absolute -bottom-10 right-8 p-1 bg-white rounded-full">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-4xl text-gray-400">
              <FaUserCircle />
            </div>
          </div>
        </div>

        <div className="pt-12 pb-8 px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-navy">
                {user?.full_name}
              </h1>
              <p className="text-gray-500 flex items-center gap-2 mt-1">
                <FaEnvelope className="text-gray-400" /> {user?.email}
              </p>
            </div>

            {/* شارة الخطة */}
            <div className="flex items-center gap-2 bg-gold/10 text-navy px-4 py-2 rounded-full border border-gold/20">
              <FaCrown className="text-gold" />
              <span className="font-bold text-sm">
                {user?.plan_tier === "FREE" ? "باقة مجانية" : "باقة المحترفين"}
              </span>
            </div>
          </div>

          <hr className="my-6 border-gray-100" />

          <h3 className="font-bold text-navy mb-4">إعدادات الحساب</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-bold text-sm text-gray-700">كلمة المرور</p>
                <p className="text-xs text-gray-500">
                  تم التغيير آخر مرة منذ شهر
                </p>
              </div>
              <button className="text-sm text-navy hover:underline font-bold">
                تغيير
              </button>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-bold text-sm text-gray-700">
                  الاشتراك والفواتير
                </p>
                <p className="text-xs text-gray-500">
                  إدارة طريقة الدفع الخاصة بك
                </p>
              </div>
              <button className="text-sm text-gold hover:text-navy hover:underline font-bold">
                ترقية الحساب
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-400 text-xs mt-6">
        رقم المعرف: <span className="font-mono">{user?.id}</span>
      </p>
    </div>
  );
};

export default Profile;
