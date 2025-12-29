import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import client from "../../api/client";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import {
  FaArrowRight,
  FaLightbulb,
  FaLayerGroup,
  FaPenFancy,
  FaChevronDown,
} from "react-icons/fa";

const NewProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    raw_description: "",
    target_sector: "GENERAL",
  });

  const sectors = [
    { value: "GENERAL", label: "عام / غير محدد" },
    { value: "TECH", label: "تطبيق / تقنية" },
    { value: "FOOD", label: "مطاعم وكافيهات" },
    { value: "REAL_ESTATE", label: "عقارات ومقاولات" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await client.post("/v1/projects/", formData);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء إنشاء المشروع، تأكد من إدخال جميع البيانات.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* زر العودة بتصميم بسيط */}
      <div className="mb-6">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-navy transition-colors text-sm font-bold group"
        >
          <FaArrowRight className="group-hover:-mr-1 transition-all duration-300" />
          العودة لقائمة المشاريع
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* رأس البطاقة */}
        <div className="bg-gradient-to-l from-navy/5 to-transparent p-8 border-b border-gray-50">
          <div className="flex items-start gap-5">
            <div className="p-4 bg-white shadow-md rounded-2xl text-gold border border-gray-100">
              <FaLightbulb size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-navy mb-2">مشروع جديد</h1>
              <p className="text-gray-500 leading-relaxed">
                كل المشاريع العظيمة بدأت بفكرة بسيطة. املأ البيانات وسيقوم
                النظام بمساعدتك في تحليلها.
              </p>
            </div>
          </div>
        </div>

        {/* عرض رسائل الخطأ */}
        {error && (
          <div className="mx-8 mt-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center gap-2">
            <span className="font-bold">تنبيه:</span> {error}
          </div>
        )}

        {/* النموذج */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* 1. عنوان المشروع */}
          <div className="group">
            {/* مفترض أن مكون Input يقبل الـ className للتخصيص، إذا لم يكن كذلك يمكن وضعه داخل div */}
            <Input
              label="اسم المشروع"
              name="title"
              placeholder="مثال: تطبيق لتوصيل القهوة، منصة عقارية..."
              value={formData.title}
              onChange={handleChange}
              // ملاحظة: تأكد أن مكون Input لديك يدعم تمرير props إضافية
              className="group-focus-within:border-gold transition-colors"
            />
          </div>

          {/* 2. قطاع المشروع (Select محسن) */}
          <div className="relative group">
            <label className="block text-navy font-bold mb-3 text-sm flex items-center gap-2">
              <FaLayerGroup className="text-gray-400" />
              قطاع المشروع
            </label>

            <div className="relative">
              <select
                name="target_sector"
                value={formData.target_sector}
                onChange={handleChange}
                className="w-full p-4 pl-10 pr-4 rounded-xl bg-gray-50 border border-gray-200 text-navy font-medium 
                           focus:outline-none focus:bg-white focus:ring-2 focus:ring-gold/20 focus:border-gold 
                           transition-all appearance-none cursor-pointer hover:bg-gray-100"
              >
                {sectors.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              {/* أيقونة السهم المخصصة (تظهر على اليسار لأن الموقع RTL) */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-gold transition-colors">
                <FaChevronDown />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 mr-1">
              يساعدنا تحديد القطاع في توفير دراسات حالة مشابهة لمشروعك.
            </p>
          </div>

          {/* 3. الوصف التفصيلي */}
          <div>
            <label className="block text-navy font-bold mb-3 text-sm flex items-center gap-2">
              <FaPenFancy className="text-gray-400" />
              تفاصيل الفكرة
            </label>
            <textarea
              name="raw_description"
              rows="6"
              placeholder="اكتب هنا كل ما يدور في ذهنك...
- ما هي المشكلة التي تحلها؟
- من هم العملاء المستهدفون؟
- كيف تتخيل شكل الحل؟"
              value={formData.raw_description}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-navy placeholder-gray-400
                         focus:outline-none focus:bg-white focus:ring-2 focus:ring-gold/20 focus:border-gold 
                         transition-all resize-none leading-relaxed"
            ></textarea>
          </div>

          {/* زر الإرسال */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
            {/* إذا كان مكون Button يدعم الـ classNames */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto min-w-[200px] text-lg py-3 shadow-lg shadow-gold/20 hover:shadow-gold/40 transition-shadow"
            >
              {loading ? (
                <span className="flex items-center gap-2">جاري الإنشاء...</span>
              ) : (
                "إطلاق المشروع 🚀"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProject;

// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import client from "../../api/client";
// import Input from "../../components/ui/Input";
// import Button from "../../components/ui/Button";
// import { FaArrowRight, FaLightbulb } from "react-icons/fa";

// const NewProject = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [formData, setFormData] = useState({
//     title: "",
//     raw_description: "",
//     target_sector: "GENERAL", // القيمة الافتراضية
//   });

//   // خيارات القطاع (مطابقة لما في الباك اند تماماً)
//   const sectors = [
//     { value: "GENERAL", label: "عام / غير محدد" },
//     { value: "TECH", label: "تطبيق / تقنية" },
//     { value: "FOOD", label: "مطاعم وكافيهات" },
//     { value: "REAL_ESTATE", label: "عقارات ومقاولات" },
//   ];

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       // إرسال البيانات للباك اند
//       await client.post("/v1/projects/", formData);

//       // نجاح! نعود لصفحة المشاريع لنرى المشروع الجديد
//       navigate("/");
//     } catch (err) {
//       console.error(err);
//       setError("حدث خطأ أثناء إنشاء المشروع، تأكد من إدخال جميع البيانات.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto">
//       {/* زر العودة */}
//       <Link
//         to="/projects"
//         className="flex items-center gap-2 text-gray-500 hover:text-navy mb-6 w-fit"
//       >
//         <FaArrowRight /> العودة للمشاريع
//       </Link>

//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="p-3 bg-gold/10 rounded-full text-gold">
//             <FaLightbulb size={24} />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-navy">
//               ابدأ مشروعاً جديداً
//             </h1>
//             <p className="text-gray-500 text-sm">
//               أخبرنا عن فكرتك لنساعدك في تحليلها وتطويرها
//             </p>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* 1. عنوان المشروع */}
//           <Input
//             label="اسم المشروع (أو الفكرة)"
//             name="title"
//             placeholder="مثال: تطبيق لتوصيل القهوة، منصة عقارية..."
//             value={formData.title}
//             onChange={handleChange}
//           />

//           {/* 2. قطاع المشروع (Select) */}
//           <div>
//             <label className="block text-gray-500 mb-2 text-sm">
//               قطاع المشروع
//             </label>
//             <select
//               name="target_sector"
//               value={formData.target_sector}
//               onChange={handleChange}
//               className="w-full p-3 rounded-lg bg-white border border-gray-300 text-navy focus:outline-none focus:border-gold transition appearance-none"
//             >
//               {sectors.map((s) => (
//                 <option key={s.value} value={s.value}>
//                   {s.label}
//                 </option>
//               ))}
//             </select>
//             <p className="text-xs text-gray-400 mt-1">
//               يساعدنا هذا في مقارنة مشروعك بالمنافسين الصحيحين.
//             </p>
//           </div>

//           {/* 3. الوصف التفصيلي (Textarea) */}
//           <div>
//             <label className="block text-gray-500 mb-2 text-sm">
//               اشرح فكرتك بالتفصيل
//             </label>
//             <textarea
//               name="raw_description"
//               rows="5"
//               placeholder="اكتب كل ما يدور في ذهنك... ما هي المشكلة التي تحلها؟ ومن هم عملاؤك؟"
//               value={formData.raw_description}
//               onChange={handleChange}
//               className="w-full p-3 rounded-lg bg-white border border-gray-300 text-navy focus:outline-none focus:border-gold transition resize-none"
//             ></textarea>
//           </div>

//           {/* زر الإرسال */}
//           <div className="pt-4">
//             <Button type="submit" disabled={loading}>
//               {loading ? "جاري الإنشاء..." : "إطلاق المشروع 🚀"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default NewProject;
