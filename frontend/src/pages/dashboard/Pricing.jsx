import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
// import client from "../../../api/client";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCrown,
  FaRocket,
} from "react-icons/fa";

const Pricing = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // دالة محاكاة الدفع (سنربطها بـ Stripe لاحقاً)
  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // هنا يتم استدعاء Stripe Checkout
      // const res = await client.post('/v1/payments/create-checkout-session/', { priceId: 'price_xxxxx' });
      // window.location.href = res.data.url;

      alert("سيتم تحويلك إلى بوابة الدفع قريباً... (هذه نسخة تجريبية)");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black text-navy mb-4">
          اختر الخطة المناسبة لطموحك
        </h1>
        <p className="text-gray-500">
          ابدأ مجاناً، وقم بالترقية عندما تحتاج أدوات المحترفين.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* --- الخطة المجانية --- */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm relative">
          <h3 className="text-xl font-bold text-gray-700">البداية (Free)</h3>
          <div className="my-6">
            <span className="text-4xl font-black text-navy">مجاناً</span>
            <span className="text-gray-400 text-sm"> / للأبد</span>
          </div>
          <p className="text-gray-500 text-sm mb-8">
            مثالية لتجربة المنصة وبناء نموذج أولي سريع.
          </p>

          <ul className="space-y-4 mb-8">
            <FeatureItem active text="تحليل منافسين (محدود)" />
            <FeatureItem active text="بناء صفحة هبوط واحدة" />
            <FeatureItem active text="نصوص AI أساسية" />
            <FeatureItem active text="ألوان أساسية فقط" />
            <FeatureItem inactive text="صور وشعار خاص" />
            <FeatureItem inactive text="قوالب احترافية (Modern)" />
            <FeatureItem inactive text="تصدير بيانات العملاء" />
          </ul>

          {user?.plan_tier === "FREE" ? (
            <button
              disabled
              className="w-full py-3 rounded-xl bg-gray-100 text-gray-400 font-bold border border-gray-200 cursor-default"
            >
              بافتك الحالية
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3 rounded-xl bg-gray-100 text-gray-400 font-bold"
            >
              متاحة دائماً
            </button>
          )}
        </div>

        {/* --- الخطة الاحترافية (PRO) --- */}
        <div className="bg-navy rounded-2xl p-8 border-2 border-gold shadow-2xl transform md:-translate-y-4 relative overflow-hidden">
          {/* شريط مميز */}
          <div className="absolute top-0 right-0 bg-gold text-navy-dark text-xs font-bold px-4 py-1 rounded-bl-lg">
            الأكثر طلباً 👑
          </div>

          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FaCrown className="text-gold" /> المحترفين (Pro)
          </h3>
          <div className="my-6">
            <span className="text-4xl font-black text-gold">29$</span>
            <span className="text-gray-300 text-sm"> / شهرياً</span>
          </div>
          <p className="text-gray-300 text-sm mb-8">
            كل ما تحتاجه لإطلاق مشروعك بهوية بصرية كاملة واحترافية.
          </p>

          <ul className="space-y-4 mb-8 text-white">
            <FeatureItem
              active
              text="تحليل منافسين غير محدود"
              color="text-gold"
            />
            <FeatureItem active text="صفحات هبوط لا محدودة" color="text-gold" />
            <FeatureItem
              active
              text="توليد استراتيجيات ذكية"
              color="text-gold"
            />
            <FeatureItem
              active
              text="رفع الشعار والصور الخاصة"
              color="text-gold"
            />
            <FeatureItem
              active
              text="جميع القوالب والألوان"
              color="text-gold"
            />
            <FeatureItem
              active
              text="تحليلات متقدمة وتصدير CSV"
              color="text-gold"
            />
            <FeatureItem active text="دعم فني متميز" color="text-gold" />
          </ul>

          {user?.plan_tier === "PRO" ? (
            <button className="w-full py-3 rounded-xl bg-green-500 text-white font-bold shadow-lg flex items-center justify-center gap-2">
              <FaCheckCircle /> أنت مشترك بالفعل
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gold hover:bg-yellow-500 text-navy-dark font-bold shadow-lg transition transform hover:scale-105"
            >
              {loading ? "جاري التحويل..." : "ترقية الآن ⚡"}
            </button>
          )}

          <p className="text-center text-xs text-gray-400 mt-4">
            ضمان استرجاع الأموال خلال 14 يوماً
          </p>
        </div>
      </div>
    </div>
  );
};

// مكون مساعد للقائمة
const FeatureItem = ({ text, inactive, color = "text-navy" }) => (
  <li
    className={`flex items-center gap-3 text-sm ${
      inactive ? "text-gray-400 opacity-50" : ""
    }`}
  >
    {inactive ? <FaTimesCircle /> : <FaCheckCircle className={color} />}
    <span>{text}</span>
  </li>
);

export default Pricing;
