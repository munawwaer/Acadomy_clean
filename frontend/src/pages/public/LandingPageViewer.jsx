import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import client from "../../api/client";
import { FaCheckCircle, FaArrowLeft, FaTimes, FaStar } from "react-icons/fa";

const LandingPageViewer = () => {
  const { slug } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  // بيانات الزائر
  const [leadEmail, setLeadEmail] = useState("");

  // حالة المودال (نافذة الأسئلة)
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  // الإجابات وحالة الإرسال
  const [answers, setAnswers] = useState({});
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle, submitting, success, error

  // 1. جلب البيانات
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await client.get(`/v1/launchpad/pages/${slug}/`);
        setPageData(res.data);
        client.post(`/v1/launchpad/pages/${slug}/track_visit/`).catch(() => {});
      } catch (err) {
        console.error("Page not found", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  // 2. معالجة الزر الأولي (عند ضغط "سجل اهتمامك")
  const handleInitialClick = (e) => {
    e.preventDefault();

    if (!leadEmail) return; // تحقق بسيط

    // هل رائد الأعمال وضع أسئلة؟
    const hasQuestions = pageData.questions && pageData.questions.length > 0;

    if (hasQuestions) {
      // نعم يوجد أسئلة -> افتح النافذة
      setShowQuestionModal(true);
    } else {
      // لا يوجد أسئلة -> أرسل البيانات فوراً
      submitLead();
    }
  };

  // 3. دالة الإرسال الفعلية (API)
  const submitLead = async () => {
    setSubmitStatus("submitting");
    try {
      await client.post("/v1/launchpad/leads/", {
        landing_page: pageData.id,
        name: "مؤيد جديد", // اسم افتراضي
        email: leadEmail,
        answers_data: answers, // الإجابات (ستكون فارغة إذا لم توجد أسئلة)
      });
      setSubmitStatus("success");
      setShowQuestionModal(false); // أغلق النافذة إذا كانت مفتوحة
    } catch (err) {
      console.error("Lead Error", err);
      setSubmitStatus("error");
    }
  };

  // 4. معالجة الإجابة داخل النافذة
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        جاري التحميل...
      </div>
    );
  if (!pageData)
    return <div className="text-center mt-20">عذراً، الصفحة غير موجودة</div>;

  const primaryColor = pageData.theme_config?.primary || "#2563EB";
  const fontFamily = pageData.theme_config?.font_family || "Tajawal";

  return (
    <div
      className="min-h-screen bg-white text-gray-800"
      style={{ fontFamily }}
      dir="rtl"
    >
      {/* === Hero Section (الواجهة) === */}
      <header
        className="relative pt-24 pb-32 px-4 text-center text-white overflow-hidden"
        style={{ backgroundColor: primaryColor }}
      >
        {/* خلفية جمالية */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            {pageData.main_headline}
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-12 max-w-2xl mx-auto leading-relaxed">
            {pageData.sub_headline}
          </p>

          {/* صندوق التسجيل الأولي (إيميل فقط) */}
          <div className="bg-white text-gray-800 rounded-2xl shadow-2xl p-2 md:p-3 max-w-lg mx-auto">
            {submitStatus === "success" ? (
              <div className="py-4 text-green-600 font-bold flex items-center justify-center gap-2 animate-fade-in">
                <FaCheckCircle size={24} /> شكراً لك! تم تسجيل اهتمامك بنجاح.
              </div>
            ) : (
              <form
                onSubmit={handleInitialClick}
                className="flex flex-col md:flex-row gap-2"
              >
                <input
                  type="email"
                  required
                  placeholder="أدخل بريدك الإلكتروني لدعم الفكرة..."
                  className="flex-1 p-4 bg-gray-50 border-none outline-none rounded-xl focus:ring-2 focus:ring-blue-100 text-gray-700 placeholder-gray-400"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-8 py-4 md:py-0 font-bold text-white rounded-xl shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2 shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  {submitStatus === "submitting"
                    ? "جاري الإرسال..."
                    : "أنا مهتم!"}
                </button>
              </form>
            )}
          </div>
          {submitStatus === "error" && (
            <p className="text-red-200 mt-4 text-sm">حدث خطأ، حاول مرة أخرى.</p>
          )}
        </div>
      </header>

      {/* === Features Section === */}
      {pageData.features_list?.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
            {pageData.features_list.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-xl mb-4 text-blue-600">
                  <FaStar />
                </div>
                <h3 className="font-bold text-xl mb-2">{feat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* === نافذة الأسئلة (Modal) === */}
      {/* تظهر فقط إذا ضغط المستخدم وكان هناك أسئلة */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
            {/* رأس النافذة */}
            <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">رأيك يهمنا!</h3>
                <p className="text-xs text-gray-500 mt-1">
                  أجب على هذه الأسئلة البسيطة لتساعدنا.
                </p>
              </div>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* جسم النافذة (الأسئلة) */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
              {pageData.questions?.map((q) => (
                <div key={q.id}>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {q.question_text}
                  </label>

                  {/* حقل نصي */}
                  {q.field_type === "TEXT" && (
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    />
                  )}

                  {/* خيارات */}
                  {q.field_type === "CHOICE" && (
                    <div className="space-y-2">
                      {q.options?.map((opt, i) => (
                        <label
                          key={i}
                          className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-lg hover:bg-gray-100 border border-transparent hover:border-gray-200 transition"
                        >
                          <input
                            type="radio"
                            name={`q_${q.id}`}
                            value={opt}
                            onChange={(e) =>
                              handleAnswerChange(q.id, e.target.value)
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* تصويت بالصور */}
                  {q.field_type === "IMAGE_VOTE" && (
                    <div className="grid grid-cols-2 gap-3">
                      {/* الخيار A */}
                      <div
                        onClick={() => handleAnswerChange(q.id, "image_a")}
                        className={`relative cursor-pointer border-2 rounded-xl overflow-hidden transition ${
                          answers[q.id] === "image_a"
                            ? "border-blue-500 ring-2 ring-blue-100"
                            : "border-gray-200"
                        }`}
                      >
                        <img
                          src={q.image_a}
                          className="w-full h-24 object-cover"
                          alt="A"
                        />
                        {answers[q.id] === "image_a" && (
                          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                            <FaCheckCircle className="text-white text-2xl" />
                          </div>
                        )}
                      </div>
                      {/* الخيار B */}
                      <div
                        onClick={() => handleAnswerChange(q.id, "image_b")}
                        className={`relative cursor-pointer border-2 rounded-xl overflow-hidden transition ${
                          answers[q.id] === "image_b"
                            ? "border-blue-500 ring-2 ring-blue-100"
                            : "border-gray-200"
                        }`}
                      >
                        <img
                          src={q.image_b}
                          className="w-full h-24 object-cover"
                          alt="B"
                        />
                        {answers[q.id] === "image_b" && (
                          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                            <FaCheckCircle className="text-white text-2xl" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ذيل النافذة (زر الإرسال النهائي) */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowQuestionModal(false)}
                className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-200 rounded-xl transition text-sm"
              >
                إلغاء
              </button>
              <button
                onClick={submitLead} // هنا يتم الإرسال النهائي
                disabled={submitStatus === "submitting"}
                className="px-8 py-3 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition flex items-center gap-2"
                style={{ backgroundColor: primaryColor }}
              >
                {submitStatus === "submitting"
                  ? "جاري الإرسال..."
                  : "تأكيد وإرسال"}{" "}
                <FaArrowLeft />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPageViewer;

// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import client from "../../api/client";
// import { FaCheckCircle, FaVoteYea } from "react-icons/fa";

// const LandingPageViewer = () => {
//   const { slug } = useParams();
//   const [pageData, setPageData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // نموذج التسجيل
//   const [leadEmail, setLeadEmail] = useState("");
//   const [leadName, setLeadName] = useState("");

//   const [answers, setAnswers] = useState({}); // { "question_id": "value" }
//   const [submitStatus, setSubmitStatus] = useState("idle");

//   useEffect(() => {
//     const fetchPage = async () => {
//       try {
//         const res = await client.get(`/v1/launchpad/pages/${slug}/`);
//         setPageData(res.data);
//         client.post(`/v1/launchpad/pages/${slug}/track_visit/`);
//       } catch (err) {
//         console.error("Page not found", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPage();
//   }, [slug]);

//   const handleJoin = async (e) => {
//     e.preventDefault();
//     setSubmitStatus("submitting");

//     try {
//       console.log(pageData);
//       await client.post("/v1/launchpad/leads/", {
//         landing_page: pageData.id,
//         name: leadName || "منور",
//         email: leadEmail,
//         answers_data: answers, // إرسال الإجابات كـ JSON
//       });
//       setSubmitStatus("success");
//     } catch (err) {
//       console.error("Lead Error", err.response?.data);
//       setSubmitStatus("error");
//       setLeadName("");
//     }
//   };

//   const handleAnswer = (questionId, value) => {
//     setAnswers({ ...answers, [questionId]: value });
//   };

//   if (loading)
//     return (
//       <div className="h-screen flex items-center justify-center">
//         جاري التحميل...
//       </div>
//     );
//   if (!pageData)
//     return <div className="text-center mt-20">الصفحة غير موجودة</div>;

//   const primaryColor = pageData.theme_config?.primary || "#2563EB";
//   const fontFamily = pageData.theme_config?.font_family || "Tajawal";

//   return (
//     <div className="min-h-screen bg-gray-50" style={{ fontFamily }}>
//       {/* Hero Section */}
//       <header
//         className="relative text-white pt-20 pb-32 px-6 text-center"
//         style={{ backgroundColor: primaryColor }}
//       >
//         <h1 className="text-4xl font-bold mb-4">{pageData.main_headline}</h1>
//         <p className="text-xl opacity-90 mb-10">{pageData.sub_headline}</p>

//         {/* Form Section */}
//         <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-2xl max-w-lg mx-auto">
//           {submitStatus === "success" ? (
//             <div className="text-center py-10">
//               <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
//               <h3 className="font-bold text-xl">شكراً لك!</h3>
//               <p className="text-gray-500">تم تسجيل بياناتك ومشاركتك بنجاح.</p>
//             </div>
//           ) : (
//             <form onSubmit={handleJoin} className="space-y-6 text-right">
//               {/* الأساسيات */}
//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-1">
//                   البريد الإلكتروني (مطلوب)
//                 </label>
//                 <input
//                   required
//                   type="email"
//                   value={leadEmail}
//                   onChange={(e) => setLeadEmail(e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                 />
//               </div>

//               {/* الأسئلة الديناميكية */}
//               {pageData.questions?.map((q) => (
//                 <div key={q.id}>
//                   <label className="block text-sm font-bold text-gray-700 mb-2">
//                     {q.question_text}
//                   </label>

//                   {/* النوع: نص */}
//                   {q.field_type === "TEXT" && (
//                     <input
//                       type="text"
//                       className="w-full p-3 border border-gray-300 rounded-lg outline-none"
//                       onChange={(e) => handleAnswer(q.id, e.target.value)}
//                     />
//                   )}

//                   {/* النوع: خيارات */}
//                   {q.field_type === "CHOICE" && (
//                     <select
//                       className="w-full p-3 border border-gray-300 rounded-lg outline-none bg-white"
//                       onChange={(e) => handleAnswer(q.id, e.target.value)}
//                     >
//                       <option value="">اختر من القائمة...</option>
//                       {(q.options || []).map((opt, i) => (
//                         <option key={i} value={opt}>
//                           {opt}
//                         </option>
//                       ))}
//                     </select>
//                   )}

//                   {/* النوع: تصويت بالصور (الميزة المدفوعة) */}
//                   {q.field_type === "IMAGE_VOTE" && (
//                     <div className="grid grid-cols-2 gap-4">
//                       <div
//                         onClick={() => handleAnswer(q.id, "image_a")}
//                         className={`cursor-pointer border-4 rounded-xl overflow-hidden relative transition hover:opacity-90 ${
//                           answers[q.id] === "image_a"
//                             ? "border-green-500 ring-2 ring-green-200"
//                             : "border-transparent"
//                         }`}
//                       >
//                         <img
//                           src={q.image_a}
//                           alt="Option A"
//                           className="w-full h-32 object-cover"
//                         />
//                         <div className="absolute bottom-0 w-full bg-black/50 text-white text-center text-xs py-1">
//                           الخيار A
//                         </div>
//                         {answers[q.id] === "image_a" && (
//                           <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
//                             <FaCheckCircle />
//                           </div>
//                         )}
//                       </div>

//                       <div
//                         onClick={() => handleAnswer(q.id, "image_b")}
//                         className={`cursor-pointer border-4 rounded-xl overflow-hidden relative transition hover:opacity-90 ${
//                           answers[q.id] === "image_b"
//                             ? "border-green-500 ring-2 ring-green-200"
//                             : "border-transparent"
//                         }`}
//                       >
//                         <img
//                           src={q.image_b}
//                           alt="Option B"
//                           className="w-full h-32 object-cover"
//                         />
//                         <div className="absolute bottom-0 w-full bg-black/50 text-white text-center text-xs py-1">
//                           الخيار B
//                         </div>
//                         {answers[q.id] === "image_b" && (
//                           <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
//                             <FaCheckCircle />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}

//               <button
//                 type="submit"
//                 className="w-full py-4 rounded-xl font-bold text-white shadow-lg text-lg transition transform hover:scale-[1.02]"
//                 style={{ backgroundColor: primaryColor }}
//               >
//                 {submitStatus === "submitting" ? "جاري الإرسال..." : "سجل الآن"}
//               </button>
//             </form>
//           )}
//         </div>
//       </header>

//       {/* Features */}
//       <section className="py-20 max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8">
//         {pageData.features_list?.map((f, i) => (
//           <div
//             key={i}
//             className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
//           >
//             <h3
//               className="font-bold text-lg mb-2"
//               style={{ color: primaryColor }}
//             >
//               {f.title}
//             </h3>
//             <p className="text-gray-600">{f.desc}</p>
//           </div>
//         ))}
//       </section>
//     </div>
//   );
// };

// export default LandingPageViewer;
// // import { useState, useEffect } from "react";
// // import { useParams } from "react-router-dom";
// // import client from "../../api/client";
// // import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

// // const LandingPageViewer = () => {
// //   const { slug } = useParams(); // نأخذ الرابط من المتصفح
// //   const [pageData, setPageData] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   // حالة نموذج التسجيل (Lead Form)
// //   const [leadName, setLeadName] = useState("");
// //   const [leadEmail, setLeadEmail] = useState("");
// //   const [submitStatus, setSubmitStatus] = useState("idle"); // idle | submitting | success | error

// //   // 1. جلب بيانات الصفحة
// //   useEffect(() => {
// //     const fetchPage = async () => {
// //       try {
// //         const res = await client.get(`/v1/launchpad/pages/${slug}/`);
// //         setPageData(res.data);

// //         // (اختياري) هنا يمكن إرسال طلب لزيادة عداد الزيارات "Track Visit"
// //         client.post(`/v1/launchpad/pages/${slug}/track_visit/`);
// //       } catch (err) {
// //         console.error("Page not found", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchPage();
// //   }, [slug]);

// //   // 2. معالجة تسجيل العميل (Lead)
// //   const handleJoin = async (e) => {
// //     e.preventDefault();
// //     setSubmitStatus("submitting");

// //     try {
// //       await client.post("/v1/launchpad/leads/", {
// //         landing_page: pageData.id, // نربط العميل بهذه الصفحة
// //         name: leadName || "زائر مهتم",
// //         email: leadEmail,
// //         answers_data: {}, // يمكن إضافة إجابات أسئلة إضافية هنا
// //       });
// //       setSubmitStatus("success");
// //       setLeadName("");
// //       setLeadEmail("");
// //     } catch (err) {
// //       if (err.response && err.response.data) {
// //         console.log("Server Error Data:", err.response.data);

// //         // تحويل كائن الخطأ إلى نص مقروء
// //         const errorMsg = JSON.stringify(err.response.data);
// //         alert(`فشل التسجيل: ${errorMsg}`); // سيظهر لك: {"email": ["هذا الحقل مطلوب"]} مثلاً
// //       } else {
// //         alert("حدث خطأ غير متوقع في الاتصال");
// //       }
// //       console.error("Lead Error", err);
// //       setSubmitStatus("error");
// //     }
// //   };

// //   if (loading)
// //     return (
// //       <div className="h-screen flex items-center justify-center text-gray-500">
// //         جاري تحميل الموقع...
// //       </div>
// //     );
// //   if (!pageData)
// //     return (
// //       <div className="h-screen flex items-center justify-center text-red-500">
// //         عذراً، هذه الصفحة غير موجودة أو تم حذفها.
// //       </div>
// //     );

// //   // استخراج الألوان
// //   const primaryColor = pageData.theme_config?.primary || "#2563EB";

// //   return (
// //     <div className="min-h-screen bg-white font-sans text-gray-900">
// //       {/* --- 1. Hero Section (الواجهة الرئيسية) --- */}
// //       <header
// //         className="relative overflow-hidden text-white pt-20 pb-32 px-6 text-center"
// //         style={{ backgroundColor: primaryColor }}
// //       >
// //         <div className="max-w-4xl mx-auto relative z-10 animate-fade-in-up">
// //           <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
// //             {pageData.theme_config?.brand_name || "قريباً"}
// //           </span>
// //           <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
// //             {pageData.main_headline}
// //           </h1>
// //           <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed">
// //             {pageData.sub_headline}
// //           </p>

// //           {/* نموذج التسجيل السريع */}
// //           <div className="bg-white p-2 rounded-full shadow-2xl max-w-lg mx-auto flex flex-col md:flex-row p-1">
// //             {submitStatus === "success" ? (
// //               <div className="w-full py-3 text-green-600 font-bold flex items-center justify-center gap-2">
// //                 <FaCheckCircle /> شكراً لك! تم تسجيل اهتمامك بنجاح.
// //               </div>
// //             ) : (
// //               <form
// //                 onSubmit={handleJoin}
// //                 className="flex flex-col md:flex-row w-full gap-2"
// //               >
// //                 <input
// //                   type="email"
// //                   required
// //                   placeholder="بريدك الإلكتروني..."
// //                   className="flex-1 px-6 py-3 rounded-full text-gray-800 outline-none"
// //                   value={leadEmail}
// //                   onChange={(e) => setLeadEmail(e.target.value)}
// //                 />
// //                 <button
// //                   type="submit"
// //                   disabled={submitStatus === "submitting"}
// //                   className="px-8 py-3 rounded-full font-bold text-white transition hover:brightness-110 shadow-lg"
// //                   style={{ backgroundColor: primaryColor }}
// //                 >
// //                   {submitStatus === "submitting"
// //                     ? "جاري التسجيل..."
// //                     : "سجل اهتمامك"}
// //                 </button>
// //               </form>
// //             )}
// //           </div>
// //           {submitStatus === "error" && (
// //             <p className="text-red-200 mt-2 text-sm">حدث خطأ، حاول مرة أخرى.</p>
// //           )}
// //         </div>

// //         {/* زخرفة خلفية */}
// //         <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
// //           <div className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
// //           <div className="absolute top-40 -left-20 w-72 h-72 bg-black rounded-full blur-3xl"></div>
// //         </div>
// //       </header>

// //       {/* --- 2. Features Section (المميزات) --- */}
// //       <section className="py-20 px-6 bg-gray-50">
// //         <div className="max-w-5xl mx-auto">
// //           <div className="text-center mb-16">
// //             <h2 className="text-3xl font-bold text-gray-900">
// //               لماذا {pageData.theme_config?.brand_name}؟
// //             </h2>
// //             <p className="text-gray-500 mt-2">حلول ذكية صممت خصيصاً لك</p>
// //           </div>

// //           <div className="grid md:grid-cols-3 gap-8">
// //             {pageData.features_list?.map((feat, idx) => (
// //               <div
// //                 key={idx}
// //                 className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100"
// //               >
// //                 <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl mb-6 text-gray-700">
// //                   ✨
// //                 </div>
// //                 <h3 className="text-xl font-bold mb-3 text-gray-800">
// //                   {feat.title}
// //                 </h3>
// //                 <p className="text-gray-600 leading-relaxed">{feat.desc}</p>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* --- 3. Footer (التذييل) --- */}
// //       <footer className="py-10 text-center text-gray-400 border-t border-gray-200 text-sm">
// //         <p>
// //           © {new Date().getFullYear()} {pageData.theme_config?.brand_name}. جميع
// //           الحقوق محفوظة.
// //         </p>
// //         <p className="mt-2 text-xs opacity-50">
// //           Powered by Incubation Platform
// //         </p>
// //       </footer>
// //     </div>
// //   );
// // };

// // export default LandingPageViewer;
