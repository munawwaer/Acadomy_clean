import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const Register = () => {
  const navigate = useNavigate();
  const { registerAction } = useAuth();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    password_confirm: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // تحقق بسيط في الفرونت قبل الإرسال
    if (formData.password !== formData.password_confirm) {
      setError("كلمات المرور غير متطابقة");
      return;
    }

    setLoading(true);

    // إرسال البيانات
    const result = await registerAction(formData);

    if (result.success) {
      // توجيه للوحة التحكم مباشرة لأن التسجيل يسجل الدخول تلقائياً
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy text-white px-4 py-10">
      <div className="w-full max-w-md bg-navy-dark p-8 rounded-2xl shadow-2xl border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gold mb-2">إنشاء حساب جديد</h1>
          <p className="text-gray-400">ابدأ رحلة مشروعك الريادي معنا</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="الاسم الكامل"
            type="text"
            name="full_name"
            placeholder="مثال: أحمد محمد"
            value={formData.full_name}
            onChange={handleChange}
          />

          <Input
            label="البريد الإلكتروني"
            type="email"
            name="email"
            placeholder="name@company.com"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="كلمة المرور"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />

          <Input
            label="تأكيد كلمة المرور"
            type="password"
            name="password_confirm"
            placeholder="••••••••"
            value={formData.password_confirm}
            onChange={handleChange}
          />

          <div className="mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? "جاري التسجيل..." : "إنشاء الحساب"}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          لديك حساب بالفعل؟{" "}
          <Link
            to="/login"
            className="text-gold cursor-pointer hover:underline"
          >
            سجل دخولك هنا
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
