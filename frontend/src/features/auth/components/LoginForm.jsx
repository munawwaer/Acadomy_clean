import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "../hooks/useLogin"; // الهوك الجديد
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  // المنطق الوحيد المتبقي هو حالة المدخلات (Form State)
  const [formData, setFormData] = useState({ email: "", password: "" });

  // استدعاء الميوتيشن من TanStack Query
  const { mutate: loginAction, isPending, error } = useLogin();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // تنفيذ عملية الدخول مع التوجيه عند النجاح
    loginAction(formData, {
      onSuccess: () => navigate(from, { replace: true }),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy text-white px-4">
      <div className="w-full max-w-md bg-navy-dark p-8 rounded-2xl shadow-2xl border border-gray-800">
        <h1 className="text-3xl font-bold text-gold mb-2 text-center">
          تسجيل الدخول
        </h1>

        {/* الخطأ يأتي مباشرة من TanStack Query */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
            {error.response?.data?.message || "حدث خطأ ما"}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="البريد الإلكتروني"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            label="كلمة المرور"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

          <div className="mt-6">
            <Button type="submit" disabled={isPending}>
              {isPending ? "جاري التحقق..." : "دخول للمنصة"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
