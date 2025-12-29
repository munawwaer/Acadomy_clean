import { createContext, useState, useEffect, useContext } from "react";
import client from "../api/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // فحص الدخول عند التحميل
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await client.get("/v1/core/profile/");
          setUser(response.data);

        } catch (error) {
          localStorage.removeItem("token");
          console.log(error);
        }
      }
      setLoading(false);
    };
    checkUserLoggedIn();
  }, []);

  // دالة تسجيل الدخول
  const loginAction = async (email, password) => {
    try {
      const response = await client.post("/v1/core/login/", {
        username: email,
        password: password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      const profileResponse = await client.get("/v1/core/profile/");
      setUser(profileResponse.data);
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error.response?.data);
      return {
        success: false,
        error:
          error.response?.data?.non_field_errors?.[0] ||
          "بيانات الدخول غير صحيحة",
      };
    }
  };

  // --- دالة إنشاء الحساب المعدلة ---
  const registerAction = async (formData) => {
    try {
      const response = await client.post('/v1/core/register/', formData);
      
      // 1. طباعة الاستجابة لنرى شكل البيانات (للتصحيح)
      console.log("Registration Response:", response.data);
      
      // 2. استخراج التوكن (تأكد أن الباك اند يرسل مفتاح اسمه token)
      const { token } = response.data;
      
      if (token) {
        // أ. حفظ التوكن
        localStorage.setItem('token', token);
        
        // ب. 🔥 خطوة هامة جداً: إجبار Axios على استخدام التوكن فوراً للطلب القادم
        client.defaults.headers.common['Authorization'] = `Token ${token}`;

        // ج. الآن نطلب البروفايل ونحن واثقون أن التوكن موجود
         const profileResponse = await client.get('/v1/core/profile/');
         setUser(profileResponse.data);
      } else {
        // في حال نجح التسجيل لكن لم يصل توكن (نادر الحدوث)
        return { success: false, error: "تم التسجيل لكن لم يتم استلام التوكن" };
      }
      
      return { success: true };

    } catch (error) {
      console.error("Register Error Detailed:", error);
      
      let errorMessage = "حدث خطأ أثناء التسجيل";
      
      if (error.response) {
        // الخطأ من السيرفر (مثل 400 أو 401)
        console.error("Server Error Data:", error.response.data);
        
        if (error.response.data) {
           const errors = error.response.data;
           // محاولة استخراج أول رسالة خطأ
           const firstKey = Object.keys(errors)[0];
           const firstError = Array.isArray(errors[firstKey]) ? errors[firstKey][0] : errors[firstKey];
           errorMessage = `${firstKey}: ${firstError}`;
        }
      } else if (error.request) {
        // السيرفر لا يرد
        errorMessage = "لا يوجد رد من الخادم، تأكد من تشغيل الباك اند";
      }

      return { success: false, error: errorMessage };
    }
  };


  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    // لا تنسَ تمرير registerAction هنا 👇
    <AuthContext.Provider
      value={{ user, loginAction, registerAction, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
