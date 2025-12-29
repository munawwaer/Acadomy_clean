import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // للتوجيه بعد الدخول
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAction } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // التعامل مع الكتابة في الحقول
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const from = location.state?.from?.pathname || "/dashboard";
  // التعامل مع الضغط على زر دخول
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await loginAction(formData.email, formData.password);

    if (result.success) {
      // 👇 التوجيه الذكي: أعده من حيث أتى
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy text-white px-4">
      <div className="w-full max-w-md bg-navy-dark p-8 rounded-2xl shadow-2xl border border-gray-800">
        {/* رأس الصفحة */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gold mb-2">تسجيل الدخول</h1>
          <p className="text-gray-400">مرحباً بك مجدداً في الحاضنة الذكية</p>
        </div>

        {/* رسالة الخطأ */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {/* النموذج */}
        <form onSubmit={handleSubmit}>
          <Input
            label="البريد الإلكتروني"
            type="email"
            name="email"
            placeholder="example@domain.com"
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

          <div className="mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? "جاري التحقق..." : "دخول للمنصة"}
            </Button>
          </div>
        </form>

        {/* روابط سفلية */}
        <div className="mt-6 text-center text-sm text-gray-500">
          ليس لديك حساب؟{" "}
          <span className="text-gold cursor-pointer hover:underline">
            أنشئ مشروعاً جديداً
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
