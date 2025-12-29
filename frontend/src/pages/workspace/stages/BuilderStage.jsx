// import { useState, useEffect } from "react";
// import client from "../../../api/client";
// import { useAuth } from "../../../context/AuthContext";
// import Button from "../../../components/ui/Button";
// import {
//   FaMobileAlt,
//   FaDesktop,
//   FaExternalLinkAlt,
//   FaPalette,
//   FaHeading,
//   FaLayerGroup,
//   FaQuestionCircle,
//   FaChevronDown,
//   FaChevronUp,
//   FaLock,
//   FaCrown,
//   FaFont,
//   FaImage,
//   FaTrash,
//   FaPlus,
//   FaUpload,
//   FaCheck,
//   FaEye,
//   FaGlobe,
//   FaSave,
//   FaBrush,
//   FaTextHeight,
//   FaMagic,
//   FaUndo,
//   FaShieldAlt,
// } from "react-icons/fa";

// const BuilderStage = ({ project }) => {
//   const { user } = useAuth();
//   const isPro = user?.plan_tier !== "FREE";

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [pageData, setPageData] = useState(null);
//   const [previewMode, setPreviewMode] = useState("desktop");
//   const [activeTab, setActiveTab] = useState("design");

//   // --- الثوابت والخيارات ---
//   const COLORS_FREE = [
//     { name: "أزرق محيط", value: "#3B82F6" },
//     { name: "بنفسجي", value: "#8B5CF6" },
//     { name: "أخضر زمردي", value: "#10B981" },
//   ];

//   const COLORS_PRO = [
//     { name: "أزرق داكن", value: "#1E40AF" },
//     { name: "بنفسجي ملكي", value: "#7C3AED" },
//     { name: "أحمر كرزي", value: "#DC2626" },
//     { name: "أسود كلاسيكي", value: "#111827" },
//     { name: "برتقالي ناري", value: "#EA580C" },
//   ];

//   const FONT_OPTIONS = [
//     { id: "Tajawal", name: "تجوال", category: "عربي" },
//     { id: "Cairo", name: "كايرو", category: "عربي" },
//     { id: "IBM Plex Sans Arabic", name: "IBM Plex", category: "عربي" },
//     { id: "Inter", name: "إنتر", category: "لاتيني" },
//   ];

//   const TEMPLATES = [
//     {
//       id: "simple",
//       name: "بسيط وأنيق",
//       description: "تصميم نظيف مع تركيز على المحتوى",
//       type: "FREE",
//       icon: "🔄",
//     },
//     {
//       id: "modern",
//       name: "عصري وجريء",
//       description: "تصميم معاصر مع تأثيرات مرئية",
//       type: "PRO",
//       icon: "⚡",
//     },
//     {
//       id: "professional",
//       name: "احترافي",
//       description: "مظهر رسمي وموثوق",
//       type: "PRO",
//       icon: "👔",
//     },
//   ];

//   // --- جلب البيانات ---
//   useEffect(() => {
//     const fetchPage = async () => {
//       if (project.landing_page_slug) {
//         try {
//           const res = await client.get(
//             `/v1/launchpad/pages/${project.landing_page_slug}/`
//           );
//           const currentData = res.data;

//           // تهيئة القيم الافتراضية
//           const defaultConfig = {
//             template_id: "simple",
//             font_family: "Tajawal",
//             font_size: "normal",
//             primary: "#3B82F6",
//             brand_name: project.title,
//             ...currentData.theme_config,
//           };

//           setPageData({
//             ...currentData,
//             theme_config: defaultConfig,
//             questions: currentData.questions || [],
//           });
//         } catch (err) {
//           console.error("Failed to load page", err);
//           // إنشاء بيانات افتراضية للعرض
//           setPageData({
//             main_headline: "عنوان مشروعك الرئيسي",
//             sub_headline: "وصف مختصر يشرح قيمة مشروعك للزوار",
//             slug: project.landing_page_slug,
//             theme_config: {
//               template_id: "simple",
//               font_family: "Tajawal",
//               font_size: "normal",
//               primary: "#3B82F6",
//               brand_name: project.title,
//             },
//             questions: [],
//           });
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
//     fetchPage();
//   }, [project]);

//   // --- إدارة الأسئلة ---
//   const handleAddQuestion = () => {
//     if (!isPro && pageData.questions.length >= 3) {
//       alert("الخطة المجانية تسمح بـ 3 أسئلة فقط. قم بالترقية لإضافة المزيد.");
//       return;
//     }

//     const newQ = {
//       tempId: Date.now(),
//       question_text: "سؤال جديد",
//       field_type: "TEXT",
//       options: [],
//       order: pageData.questions.length,
//       required: true,
//     };
//     setPageData({ ...pageData, questions: [...pageData.questions, newQ] });
//   };

//   const handleUpdateQuestion = (index, key, value) => {
//     const updatedQuestions = [...pageData.questions];
//     updatedQuestions[index][key] = value;
//     setPageData({ ...pageData, questions: updatedQuestions });
//   };

//   const handleDeleteQuestion = (index) => {
//     if (confirm("هل تريد حذف هذا السؤال؟")) {
//       const updatedQuestions = [...pageData.questions];
//       updatedQuestions.splice(index, 1);
//       setPageData({ ...pageData, questions: updatedQuestions });
//     }
//   };

//   // --- دوال التغيير ---
//   const handleChange = (e) => {
//     setPageData({ ...pageData, [e.target.name]: e.target.value });
//   };

//   const handleConfigChange = (key, value) => {
//     setPageData({
//       ...pageData,
//       theme_config: { ...pageData.theme_config, [key]: value },
//     });
//   };

//   const handleThemeChange = (color, isPremium) => {
//     if (isPremium && !isPro) {
//       alert(
//         "هذا اللون متاح فقط في باقة المحترفين. قم بالترقية للوصول إلى جميع الميزات."
//       );
//       return;
//     }
//     handleConfigChange("primary", color);
//   };

//   const handleTemplateChange = (template) => {
//     if (template.type === "PRO" && !isPro) {
//       alert("هذا التصميم متاح فقط في باقة المحترفين. قم بالترقية الآن!");
//       return;
//     }
//     handleConfigChange("template_id", template.id);
//   };

//   // --- دالة الحفظ ---
//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       const formData = new FormData();
//       formData.append("main_headline", pageData.main_headline);
//       formData.append("sub_headline", pageData.sub_headline);
//       formData.append("theme_config", JSON.stringify(pageData.theme_config));

//       pageData.questions.forEach((q, index) => {
//         if (q.id) {
//           formData.append(`questions[${index}]id`, q.id);
//         }
//         formData.append(`questions[${index}]question_text`, q.question_text);
//         formData.append(`questions[${index}]field_type`, q.field_type);
//         formData.append(`questions[${index}]order`, index);
//         formData.append(`questions[${index}]required`, q.required);

//         if (Array.isArray(q.options) && q.options.length > 0) {
//           formData.append(
//             `questions[${index}]options`,
//             JSON.stringify(q.options)
//           );
//         } else {
//           formData.append(`questions[${index}]options`, JSON.stringify([]));
//         }

//         if (q.image_a instanceof File)
//           formData.append(`questions[${index}]image_a`, q.image_a);
//         if (q.image_b instanceof File)
//           formData.append(`questions[${index}]image_b`, q.image_b);
//       });

//       await client.patch(
//         `/v1/launchpad/pages/${project.landing_page_slug}/`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       // إشعار النجاح
//       const event = new CustomEvent("show-toast", {
//         detail: { message: "تم حفظ التغييرات بنجاح", type: "success" },
//       });
//       window.dispatchEvent(event);
//     } catch (err) {
//       console.error("Save Error", err);
//       const event = new CustomEvent("show-toast", {
//         detail: { message: "فشل في حفظ التغييرات", type: "error" },
//       });
//       window.dispatchEvent(event);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // --- نسخ احتياطي للتصميم ---
//   const handleResetDesign = () => {
//     if (
//       confirm(
//         "هل تريد استعادة الإعدادات الافتراضية؟ سيتم فقدان التغييرات غير المحفوظة."
//       )
//     ) {
//       setPageData({
//         ...pageData,
//         theme_config: {
//           template_id: "simple",
//           font_family: "Tajawal",
//           font_size: "normal",
//           primary: "#3B82F6",
//           brand_name: project.title,
//         },
//       });
//     }
//   };

//   // --- حالات التحميل ---
//   if (!project.landing_page_slug) {
//     return (
//       <div className="min-h-[400px] flex items-center justify-center p-8">
//         <div className="text-center max-w-md">
//           <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
//             <FaGlobe className="text-blue-600 text-2xl" />
//           </div>
//           <h3 className="text-lg font-semibold text-gray-800 mb-3">
//             لم يتم إنشاء الصفحة بعد
//           </h3>
//           <p className="text-gray-600 text-sm mb-6">
//             يجب إنشاء صفحة الهبوط أولاً من خلال مرحلة الاستراتيجية.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (loading || !pageData) {
//     return (
//       <div className="min-h-[400px] flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-500 text-sm">جاري تحميل مصمم الصفحة...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-blue-50/30">
//       {/* --- شريط التحكم العلوي --- */}
//       <div className="bg-white border-b border-gray-200 px-6 py-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
//                 <FaBrush className="text-white text-sm" />
//               </div>
//               <div>
//                 <h2 className="font-bold text-gray-800">مصمم الصفحة</h2>
//                 <p className="text-xs text-gray-500">{project.title}</p>
//               </div>
//             </div>

//             <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg p-1">
//               <button
//                 onClick={() => setActiveTab("design")}
//                 className={`px-4 py-2 rounded text-sm font-medium transition-all ${
//                   activeTab === "design"
//                     ? "bg-white shadow text-blue-600"
//                     : "text-gray-600 hover:text-gray-800"
//                 }`}
//               >
//                 <FaPalette className="inline mr-2" />
//                 التصميم
//               </button>
//               <button
//                 onClick={() => setActiveTab("content")}
//                 className={`px-4 py-2 rounded text-sm font-medium transition-all ${
//                   activeTab === "content"
//                     ? "bg-white shadow text-blue-600"
//                     : "text-gray-600 hover:text-gray-800"
//                 }`}
//               >
//                 <FaHeading className="inline mr-2" />
//                 المحتوى
//               </button>
//               <button
//                 onClick={() => setActiveTab("form")}
//                 className={`px-4 py-2 rounded text-sm font-medium transition-all ${
//                   activeTab === "form"
//                     ? "bg-white shadow text-blue-600"
//                     : "text-gray-600 hover:text-gray-800"
//                 }`}
//               >
//                 <FaQuestionCircle className="inline mr-2" />
//                 النموذج
//               </button>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               onClick={handleResetDesign}
//               className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
//             >
//               <FaUndo />
//               <span className="hidden md:inline">استعادة</span>
//             </button>

//             <div className="flex gap-2">
//               <button
//                 onClick={() => setPreviewMode("mobile")}
//                 className={`p-2 rounded-lg ${
//                   previewMode === "mobile"
//                     ? "bg-blue-100 text-blue-600"
//                     : "text-gray-500 hover:text-gray-700"
//                 }`}
//                 title="عرض الجوال"
//               >
//                 <FaMobileAlt />
//               </button>
//               <button
//                 onClick={() => setPreviewMode("desktop")}
//                 className={`p-2 rounded-lg ${
//                   previewMode === "desktop"
//                     ? "bg-blue-100 text-blue-600"
//                     : "text-gray-500 hover:text-gray-700"
//                 }`}
//                 title="عرض الكمبيوتر"
//               >
//                 <FaDesktop />
//               </button>
//             </div>

//             <Button
//               onClick={handleSave}
//               disabled={saving}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2"
//             >
//               {saving ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                   جاري الحفظ...
//                 </>
//               ) : (
//                 <>
//                   <FaSave />
//                   حفظ
//                 </>
//               )}
//             </Button>

//             <a
//               href={`/p/${pageData.slug}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
//               title="فتح في نافذة جديدة"
//             >
//               <FaExternalLinkAlt />
//             </a>
//           </div>
//         </div>

//         {/* شريط التبويب للجوال */}
//         <div className="flex md:hidden gap-2 mt-3 overflow-x-auto pb-1">
//           <button
//             onClick={() => setActiveTab("design")}
//             className={`px-3 py-2 rounded text-sm font-medium whitespace-nowrap ${
//               activeTab === "design"
//                 ? "bg-blue-100 text-blue-600"
//                 : "text-gray-600"
//             }`}
//           >
//             التصميم
//           </button>
//           <button
//             onClick={() => setActiveTab("content")}
//             className={`px-3 py-2 rounded text-sm font-medium whitespace-nowrap ${
//               activeTab === "content"
//                 ? "bg-blue-100 text-blue-600"
//                 : "text-gray-600"
//             }`}
//           >
//             المحتوى
//           </button>
//           <button
//             onClick={() => setActiveTab("form")}
//             className={`px-3 py-2 rounded text-sm font-medium whitespace-nowrap ${
//               activeTab === "form"
//                 ? "bg-blue-100 text-blue-600"
//                 : "text-gray-600"
//             }`}
//           >
//             النموذج
//           </button>
//         </div>
//       </div>

//       {/* --- المحتوى الرئيسي --- */}
//       <div className="flex-1 flex overflow-hidden">
//         {/* --- شريط أدوات التصميم --- */}
//         {activeTab === "design" && (
//           <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
//             <div className="p-4 border-b border-gray-100">
//               <h3 className="font-semibold text-gray-800 mb-1">
//                 إعدادات التصميم
//               </h3>
//               <p className="text-xs text-gray-500">قم بتخصيص مظهر صفحتك</p>
//             </div>

//             <div className="flex-1 overflow-y-auto p-4 space-y-6">
//               {/* الألوان */}
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <h4 className="text-sm font-medium text-gray-700">الألوان</h4>
//                   <FaPalette className="text-gray-400 text-sm" />
//                 </div>

//                 <div>
//                   <p className="text-xs text-gray-600 mb-3">الألوان الأساسية</p>
//                   <div className="grid grid-cols-5 gap-3">
//                     {COLORS_FREE.map((color) => (
//                       <button
//                         key={color.value}
//                         onClick={() => handleThemeChange(color.value, false)}
//                         className="group relative"
//                       >
//                         <div
//                           className={`w-10 h-10 rounded-lg border-2 transition-all ${
//                             pageData.theme_config?.primary === color.value
//                               ? "border-blue-500 scale-105 shadow-md"
//                               : "border-gray-200 hover:border-gray-300"
//                           }`}
//                           style={{ backgroundColor: color.value }}
//                         />
//                         <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
//                           {color.name}
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="border-t border-gray-100 pt-4">
//                   <div className="flex items-center justify-between mb-3">
//                     <p className="text-xs text-gray-600">ألوان احترافية</p>
//                     {!isPro && (
//                       <span className="text-xs bg-gradient-to-r from-yellow-50 to-orange-50 text-amber-700 px-2 py-1 rounded-full flex items-center gap-1">
//                         <FaCrown className="text-xs" />
//                         Pro
//                       </span>
//                     )}
//                   </div>
//                   <div className="grid grid-cols-5 gap-3">
//                     {COLORS_PRO.map((color) => (
//                       <button
//                         key={color.value}
//                         onClick={() => handleThemeChange(color.value, true)}
//                         className={`group relative ${
//                           !isPro ? "opacity-60" : ""
//                         }`}
//                         disabled={!isPro}
//                       >
//                         <div
//                           className={`w-10 h-10 rounded-lg border-2 transition-all ${
//                             pageData.theme_config?.primary === color.value
//                               ? "border-blue-500 scale-105 shadow-md"
//                               : "border-gray-200 hover:border-gray-300"
//                           }`}
//                           style={{ backgroundColor: color.value }}
//                         />
//                         {!isPro && (
//                           <div className="absolute inset-0 flex items-center justify-center">
//                             <FaLock className="text-white/80 text-xs drop-shadow" />
//                           </div>
//                         )}
//                         <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
//                           {color.name}
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* القوالب */}
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <h4 className="text-sm font-medium text-gray-700">
//                     قوالب التصميم
//                   </h4>
//                   <FaLayerGroup className="text-gray-400 text-sm" />
//                 </div>

//                 <div className="space-y-3">
//                   {TEMPLATES.map((template) => (
//                     <div
//                       key={template.id}
//                       onClick={() => handleTemplateChange(template)}
//                       className={`p-3 rounded-lg border cursor-pointer transition-all ${
//                         pageData.theme_config.template_id === template.id
//                           ? "border-blue-500 bg-blue-50"
//                           : "border-gray-200 hover:border-gray-300"
//                       } ${
//                         template.type === "PRO" && !isPro ? "opacity-60" : ""
//                       }`}
//                     >
//                       <div className="flex items-center justify-between mb-2">
//                         <div className="flex items-center gap-2">
//                           <span className="text-lg">{template.icon}</span>
//                           <span className="text-sm font-medium text-gray-800">
//                             {template.name}
//                           </span>
//                         </div>
//                         {template.type === "PRO" && (
//                           <span
//                             className={`text-xs px-2 py-1 rounded-full ${
//                               isPro
//                                 ? "bg-blue-100 text-blue-700"
//                                 : "bg-gray-100 text-gray-500"
//                             }`}
//                           >
//                             {isPro ? (
//                               "Pro"
//                             ) : (
//                               <FaLock className="inline" size={10} />
//                             )}
//                           </span>
//                         )}
//                       </div>
//                       <p className="text-xs text-gray-600">
//                         {template.description}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* الخطوط */}
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <h4 className="text-sm font-medium text-gray-700">الخطوط</h4>
//                   <FaFont className="text-gray-400 text-sm" />
//                 </div>

//                 <div className="space-y-3">
//                   {FONT_OPTIONS.map((font) => (
//                     <button
//                       key={font.id}
//                       onClick={() => handleConfigChange("font_family", font.id)}
//                       className={`w-full p-3 rounded-lg border text-right transition-all ${
//                         pageData.theme_config?.font_family === font.id
//                           ? "border-blue-500 bg-blue-50 text-blue-700"
//                           : "border-gray-200 hover:border-gray-300 text-gray-700"
//                       }`}
//                       style={{ fontFamily: font.id }}
//                     >
//                       <div className="flex justify-between items-center">
//                         <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                           {font.category}
//                         </span>
//                         <span className="text-sm font-medium">{font.name}</span>
//                       </div>
//                     </button>
//                   ))}
//                 </div>

//                 <div>
//                   <label className="text-xs text-gray-600 mb-2 block">
//                     حجم الخط
//                   </label>
//                   <div className="grid grid-cols-3 gap-2">
//                     {["صغير", "متوسط", "كبير"].map((size, index) => (
//                       <button
//                         key={size}
//                         onClick={() =>
//                           handleConfigChange(
//                             "font_size",
//                             ["small", "normal", "large"][index]
//                           )
//                         }
//                         className={`py-2 rounded-lg border text-sm transition-all ${
//                           pageData.theme_config?.font_size ===
//                           ["small", "normal", "large"][index]
//                             ? "border-blue-500 bg-blue-50 text-blue-700"
//                             : "border-gray-200 text-gray-600 hover:border-gray-300"
//                         }`}
//                       >
//                         {size}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* --- محتوى المحرر --- */}
//         {activeTab === "content" && (
//           <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
//             <div className="p-4 border-b border-gray-100">
//               <h3 className="font-semibold text-gray-800 mb-1">المحتوى</h3>
//               <p className="text-xs text-gray-500">
//                 عدل النصوص والعناصر الرئيسية
//               </p>
//             </div>

//             <div className="flex-1 overflow-y-auto p-4 space-y-6">
//               <div className="space-y-4">
//                 <div>
//                   <label className="text-sm font-medium text-gray-700 mb-2 block">
//                     العنوان الرئيسي
//                   </label>
//                   <textarea
//                     name="main_headline"
//                     value={pageData.main_headline}
//                     onChange={handleChange}
//                     rows="2"
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-lg font-medium"
//                     placeholder="اكتب العنوان الرئيسي..."
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium text-gray-700 mb-2 block">
//                     الوصف
//                   </label>
//                   <textarea
//                     name="sub_headline"
//                     value={pageData.sub_headline}
//                     onChange={handleChange}
//                     rows="4"
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
//                     placeholder="اكتب وصف صفحتك..."
//                   />
//                 </div>
//               </div>

//               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
//                 <div className="flex items-center gap-2 mb-2">
//                   <FaMagic className="text-blue-600" />
//                   <h4 className="text-sm font-medium text-blue-800">
//                     اقتراحات ذكية
//                   </h4>
//                 </div>
//                 <p className="text-xs text-blue-600 mb-3">
//                   استخدم لغة واضحة وجذابة تشرح قيمة مشروعك للزوار
//                 </p>
//                 <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
//                   توليد نص ذكي
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* --- محتوى النموذج --- */}
//         {activeTab === "form" && (
//           <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
//             <div className="p-4 border-b border-gray-100">
//               <div className="flex items-center justify-between mb-1">
//                 <h3 className="font-semibold text-gray-800">النموذج</h3>
//                 <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
//                   {pageData.questions.length} سؤال
//                 </span>
//               </div>
//               <p className="text-xs text-gray-500">
//                 أضف أسئلة لجمع بيانات الزوار
//               </p>
//             </div>

//             <div className="flex-1 overflow-y-auto p-4">
//               <div className="space-y-4 mb-6">
//                 {pageData.questions.map((q, idx) => (
//                   <div
//                     key={q.id || q.tempId}
//                     className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
//                   >
//                     <div className="flex items-start justify-between mb-3">
//                       <div className="flex-1">
//                         <input
//                           value={q.question_text}
//                           onChange={(e) =>
//                             handleUpdateQuestion(
//                               idx,
//                               "question_text",
//                               e.target.value
//                             )
//                           }
//                           className="w-full p-2 border-b border-gray-200 focus:border-blue-500 focus:outline-none text-sm font-medium text-gray-800"
//                           placeholder="نص السؤال"
//                         />
//                       </div>
//                       <button
//                         onClick={() => handleDeleteQuestion(idx)}
//                         className="text-gray-400 hover:text-red-500 p-1"
//                       >
//                         <FaTrash size={14} />
//                       </button>
//                     </div>

//                     <div className="space-y-3">
//                       <div>
//                         <label className="text-xs text-gray-600 mb-2 block">
//                           نوع الإجابة
//                         </label>
//                         <select
//                           value={q.field_type}
//                           onChange={(e) => {
//                             if (e.target.value === "IMAGE_VOTE" && !isPro) {
//                               alert("ميزة التصويت بالصور متاحة للمحترفين فقط");
//                               return;
//                             }
//                             handleUpdateQuestion(
//                               idx,
//                               "field_type",
//                               e.target.value
//                             );
//                           }}
//                           className="w-full p-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
//                         >
//                           <option value="TEXT">نص قصير</option>
//                           <option value="CHOICE">اختيار من متعدد</option>
//                           <option value="IMAGE_VOTE">تصويت بالصور</option>
//                         </select>
//                       </div>

//                       {q.field_type === "CHOICE" && (
//                         <div>
//                           <label className="text-xs text-gray-600 mb-2 block">
//                             الخيارات
//                           </label>
//                           <input
//                             placeholder="أحمر، أخضر، أزرق"
//                             className="w-full p-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
//                             onChange={(e) =>
//                               handleUpdateQuestion(
//                                 idx,
//                                 "options",
//                                 e.target.value.split("،").map((s) => s.trim())
//                               )
//                             }
//                           />
//                         </div>
//                       )}

//                       {q.field_type === "IMAGE_VOTE" && (
//                         <div className="space-y-3">
//                           <div>
//                             <label className="text-xs text-gray-600 mb-2 block">
//                               صورة A
//                             </label>
//                             <div className="flex items-center gap-2">
//                               <input
//                                 type="file"
//                                 className="flex-1 text-sm"
//                                 onChange={(e) =>
//                                   handleUpdateQuestion(
//                                     idx,
//                                     "image_a",
//                                     e.target.files[0]
//                                   )
//                                 }
//                                 disabled={!isPro}
//                               />
//                             </div>
//                           </div>
//                           <div>
//                             <label className="text-xs text-gray-600 mb-2 block">
//                               صورة B
//                             </label>
//                             <div className="flex items-center gap-2">
//                               <input
//                                 type="file"
//                                 className="flex-1 text-sm"
//                                 onChange={(e) =>
//                                   handleUpdateQuestion(
//                                     idx,
//                                     "image_b",
//                                     e.target.files[0]
//                                   )
//                                 }
//                                 disabled={!isPro}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       <div className="flex items-center justify-between pt-2 border-t border-gray-100">
//                         <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
//                           <input
//                             type="checkbox"
//                             checked={q.required}
//                             onChange={(e) =>
//                               handleUpdateQuestion(
//                                 idx,
//                                 "required",
//                                 e.target.checked
//                               )
//                             }
//                             className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                           />
//                           إجباري
//                         </label>
//                         <span className="text-xs text-gray-400">
//                           #{idx + 1}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <button
//                 onClick={handleAddQuestion}
//                 className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2 font-medium"
//               >
//                 <FaPlus />
//                 إضافة سؤال جديد
//               </button>

//               {!isPro && pageData.questions.length >= 3 && (
//                 <div className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
//                   <div className="flex items-center gap-2 mb-2">
//                     <FaCrown className="text-amber-600" />
//                     <h4 className="text-sm font-medium text-amber-800">
//                       ترقية إلى Pro
//                     </h4>
//                   </div>
//                   <p className="text-xs text-amber-700 mb-3">
//                     قم بالترقية لإضافة المزيد من الأسئلة والوصول إلى جميع
//                     الميزات
//                   </p>
//                   <button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-medium py-2 rounded-lg hover:shadow-md transition">
//                     ترقية الآن
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* --- منطقة المعاينة الرئيسية --- */}
//         <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-auto">
//           <div className="relative">
//             {/* إطار المعاينة */}
//             <div
//               className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ${
//                 previewMode === "mobile" ? "w-[360px]" : "w-full max-w-6xl"
//               }`}
//             >
//               {/* شريط حالة الجوال */}
//               {previewMode === "mobile" && (
//                 <div className="h-6 bg-gradient-to-r from-gray-800 to-gray-900 relative">
//                   <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-xs">
//                     9:41
//                   </div>
//                   <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
//                     <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
//                     <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
//                     <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-500 rounded-full"></div>
//                   </div>
//                 </div>
//               )}

//               {/* محتوى الصفحة */}
//               <div
//                 className={`overflow-y-auto ${
//                   previewMode === "mobile" ? "h-[640px]" : "max-h-[80vh]"
//                 }`}
//                 style={{ fontFamily: pageData.theme_config.font_family }}
//               >
//                 {/* الهيدر */}
//                 <div
//                   className={`${
//                     pageData.theme_config.template_id === "simple"
//                       ? "bg-gradient-to-br from-blue-600 to-blue-700"
//                       : "bg-white"
//                   } p-6 md:p-12`}
//                 >
//                   <div className="container mx-auto">
//                     <div className="flex justify-between items-center mb-8">
//                       <div
//                         className={`text-lg font-bold ${
//                           pageData.theme_config.template_id === "simple"
//                             ? "text-white/90"
//                             : "text-gray-900"
//                         }`}
//                         style={
//                           pageData.theme_config.template_id !== "simple"
//                             ? { color: pageData.theme_config.primary }
//                             : {}
//                         }
//                       >
//                         {pageData.theme_config.brand_name}
//                       </div>
//                       {pageData.theme_config.template_id !== "simple" && (
//                         <button
//                           className="px-4 py-2 rounded-lg text-sm font-medium transition hover:shadow-md"
//                           style={{
//                             backgroundColor: pageData.theme_config.primary,
//                             color: "white",
//                           }}
//                         >
//                           تجربة مجانية
//                         </button>
//                       )}
//                     </div>

//                     <div
//                       className={`text-center ${
//                         pageData.theme_config.template_id === "simple"
//                           ? ""
//                           : "text-right"
//                       }`}
//                     >
//                       <h1
//                         className={`font-bold leading-tight mb-4 ${
//                           pageData.theme_config.template_id === "simple"
//                             ? "text-white"
//                             : "text-gray-900"
//                         }
//                         ${
//                           pageData.theme_config.font_size === "large"
//                             ? "text-4xl md:text-5xl"
//                             : pageData.theme_config.font_size === "small"
//                             ? "text-2xl md:text-3xl"
//                             : "text-3xl md:text-4xl"
//                         }`}
//                       >
//                         {pageData.main_headline}
//                       </h1>

//                       <p
//                         className={`mb-8 ${
//                           pageData.theme_config.template_id === "simple"
//                             ? "text-white/90"
//                             : "text-gray-600"
//                         }
//                         ${
//                           pageData.theme_config.font_size === "large"
//                             ? "text-lg"
//                             : pageData.theme_config.font_size === "small"
//                             ? "text-sm"
//                             : "text-base"
//                         }`}
//                       >
//                         {pageData.sub_headline}
//                       </p>

//                       <button
//                         className={`px-8 py-3 rounded-lg font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl
//                         ${
//                           pageData.theme_config.template_id === "simple"
//                             ? "bg-white text-blue-600"
//                             : "text-white"
//                         }`}
//                         style={
//                           pageData.theme_config.template_id !== "simple"
//                             ? { backgroundColor: pageData.theme_config.primary }
//                             : {}
//                         }
//                       >
//                         {pageData.theme_config.template_id === "simple"
//                           ? "ابدأ الآن"
//                           : "سجل اهتمامك"}
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* نموذج التسجيل */}
//                 <div className="p-6 md:p-12 bg-gradient-to-b from-white to-gray-50">
//                   <div className="container mx-auto max-w-2xl">
//                     <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
//                       <div className="text-center mb-8">
//                         <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                           <FaShieldAlt className="text-blue-600 text-xl" />
//                         </div>
//                         <h3 className="text-xl font-bold text-gray-900 mb-2">
//                           سجل معلوماتك
//                         </h3>
//                         <p className="text-gray-600">املأ النموذج للمتابعة</p>
//                       </div>

//                       <div className="space-y-4">
//                         {/* حقل البريد الإلكتروني */}
//                         <div>
//                           <label className="text-sm font-medium text-gray-700 mb-2 block">
//                             البريد الإلكتروني
//                           </label>
//                           <input
//                             type="email"
//                             placeholder="example@email.com"
//                             className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                             disabled
//                           />
//                         </div>

//                         {/* الأسئلة الديناميكية */}
//                         {pageData.questions.map((q, idx) => (
//                           <div key={idx} className="space-y-2">
//                             <div className="flex items-center justify-between">
//                               <label className="text-sm font-medium text-gray-700">
//                                 {q.question_text}
//                               </label>
//                               {q.required && (
//                                 <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
//                                   إجباري
//                                 </span>
//                               )}
//                             </div>

//                             {q.field_type === "TEXT" && (
//                               <input
//                                 type="text"
//                                 placeholder="اكتب إجابتك هنا..."
//                                 className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                                 disabled
//                               />
//                             )}

//                             {q.field_type === "CHOICE" && (
//                               <select
//                                 className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                                 disabled
//                               >
//                                 <option>اختر من القائمة...</option>
//                                 {q.options?.map((option, i) => (
//                                   <option key={i}>{option}</option>
//                                 ))}
//                               </select>
//                             )}

//                             {q.field_type === "IMAGE_VOTE" && (
//                               <div className="grid grid-cols-2 gap-4">
//                                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 cursor-pointer transition">
//                                   <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
//                                     <FaImage className="text-blue-600" />
//                                   </div>
//                                   <span className="text-sm text-gray-600">
//                                     صورة A
//                                   </span>
//                                 </div>
//                                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 cursor-pointer transition">
//                                   <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
//                                     <FaImage className="text-blue-600" />
//                                   </div>
//                                   <span className="text-sm text-gray-600">
//                                     صورة B
//                                   </span>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         ))}

//                         <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 mt-6">
//                           إرسال النموذج
//                         </button>

//                         <p className="text-xs text-gray-500 text-center mt-4">
//                           بمواصلة النموذج، أنت توافق على{" "}
//                           <a href="#" className="text-blue-600 hover:underline">
//                             شروط الخدمة
//                           </a>
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* شريط حالة المعاينة */}
//             <div className="mt-4 flex items-center justify-center gap-4">
//               <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
//                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
//                 <span className="text-xs text-gray-600">المعاينة مباشرة</span>
//               </div>
//               <div className="text-xs text-gray-500">
//                 {previewMode === "mobile" ? "عرض الجوال" : "عرض الكمبيوتر"}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BuilderStage;
// BuilderStage.jsx - النسخة المعدلة
import { useState, useEffect } from "react";
import client from "../../../api/client";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../../components/ui/Button";
import AlertDialog from "../../../components/ui/AlertDialog"; // استيراد المكون الجديد
import {
  FaMobileAlt,
  FaDesktop,
  FaExternalLinkAlt,
  FaPalette,
  FaHeading,
  FaLayerGroup,
  FaQuestionCircle,
  FaLock,
  FaCrown,
  FaFont,
  FaImage,
  FaTrash,
  FaPlus,
  FaCheck,
  FaEye,
  FaGlobe,
  FaSave,
  FaBrush,
  FaMagic,
  FaUndo,
  FaShieldAlt,
} from "react-icons/fa";

const BuilderStage = ({ project }) => {
  const { user } = useAuth();
  const isPro = user?.plan_tier !== "FREE";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState(null);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [activeTab, setActiveTab] = useState("design");
  
  // حالات نافذة التنبيه
  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  // عرض نافذة التنبيه
  const showAlert = (title, message, type = "info", onConfirm = null) => {
    setAlertDialog({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
    });
  };

  // إغلاق نافذة التنبيه
  const closeAlert = () => {
    setAlertDialog({
      isOpen: false,
      title: "",
      message: "",
      type: "info",
      onConfirm: null,
    });
  };

  // --- جلب البيانات ---
  useEffect(() => {
    const fetchPage = async () => {
      if (project.landing_page_slug) {
        try {
          const res = await client.get(
            `/v1/launchpad/pages/${project.landing_page_slug}/`
          );
          const currentData = res.data;

          // تهيئة القيم الافتراضية
          const defaultConfig = {
            template_id: "simple",
            font_family: "Tajawal",
            font_size: "normal",
            primary: "#3B82F6",
            brand_name: project.title,
            ...currentData.theme_config
          };

          setPageData({
            ...currentData,
            theme_config: defaultConfig,
            questions: currentData.questions || []
          });
        } catch (err) {
          console.error("Failed to load page", err);
          setPageData({
            main_headline: "عنوان مشروعك الرئيسي",
            sub_headline: "وصف مختصر يشرح قيمة مشروعك للزوار",
            slug: project.landing_page_slug,
            theme_config: {
              template_id: "simple",
              font_family: "Tajawal",
              font_size: "normal",
              primary: "#3B82F6",
              brand_name: project.title,
            },
            questions: []
          });
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPage();
  }, [project]);

  // --- إدارة الأسئلة ---
  const handleAddQuestion = () => {
    if (!isPro && pageData.questions.length >= 3) {
      showAlert(
        "حد أقصى للأسئلة",
        "الخطة المجانية تسمح بـ 3 أسئلة فقط. قم بالترقية لإضافة المزيد من الأسئلة والميزات المتقدمة.",
        "warning"
      );
      return;
    }

    const newQ = {
      tempId: Date.now(),
      question_text: "سؤال جديد",
      field_type: "TEXT",
      options: [],
      order: pageData.questions.length,
      required: true
    };
    setPageData({ ...pageData, questions: [...pageData.questions, newQ] });
  };

  const handleUpdateQuestion = (index, key, value) => {
    const updatedQuestions = [...pageData.questions];
    updatedQuestions[index][key] = value;
    setPageData({ ...pageData, questions: updatedQuestions });
  };

  const handleDeleteQuestion = (index) => {
    showAlert(
      "حذف السؤال",
      "هل أنت متأكد من رغبتك في حذف هذا السؤال؟ لا يمكن التراجع عن هذه العملية.",
      "warning",
      () => {
        const updatedQuestions = [...pageData.questions];
        updatedQuestions.splice(index, 1);
        setPageData({ ...pageData, questions: updatedQuestions });
      }
    );
  };

  // --- دوال التغيير ---
  const handleChange = (e) => {
    setPageData({ ...pageData, [e.target.name]: e.target.value });
  };

  const handleConfigChange = (key, value) => {
    setPageData({
      ...pageData,
      theme_config: { ...pageData.theme_config, [key]: value },
    });
  };

  const handleThemeChange = (color, isPremium) => {
    if (isPremium && !isPro) {
      showAlert(
        "ميزة للمحترفين",
        "هذا اللون متاح فقط في باقة المحترفين. قم بالترقية للوصول إلى جميع الألوان والميزات المتقدمة.",
        "info"
      );
      return;
    }
    handleConfigChange("primary", color);
  };

  const handleTemplateChange = (template) => {
    if (template.type === "PRO" && !isPro) {
      showAlert(
        "تصميم للمحترفين",
        "هذا التصميم متاح فقط في باقة المحترفين. قم بالترقية للوصول إلى جميع القوالب والميزات المتقدمة.",
        "info"
      );
      return;
    }
    handleConfigChange("template_id", template.id);
  };

  // --- دالة الحفظ ---
  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("main_headline", pageData.main_headline);
      formData.append("sub_headline", pageData.sub_headline);
      formData.append("theme_config", JSON.stringify(pageData.theme_config));

      pageData.questions.forEach((q, index) => {
        if (q.id) {
          formData.append(`questions[${index}]id`, q.id);
        }
        formData.append(`questions[${index}]question_text`, q.question_text);
        formData.append(`questions[${index}]field_type`, q.field_type);
        formData.append(`questions[${index}]order`, index);
        formData.append(`questions[${index}]required`, q.required);

        if (Array.isArray(q.options) && q.options.length > 0) {
          formData.append(
            `questions[${index}]options`,
            JSON.stringify(q.options)
          );
        } else {
          formData.append(`questions[${index}]options`, JSON.stringify([]));
        }

        if (q.image_a instanceof File)
          formData.append(`questions[${index}]image_a`, q.image_a);
        if (q.image_b instanceof File)
          formData.append(`questions[${index}]image_b`, q.image_b);
      });

      await client.patch(
        `/v1/launchpad/pages/${project.landing_page_slug}/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // إشعار النجاح
      showAlert(
        "تم الحفظ بنجاح",
        "تم حفظ جميع التغييرات على صفحتك بنجاح.",
        "success"
      );

    } catch (err) {
      console.error("Save Error", err);
      showAlert(
        "فشل في الحفظ",
        "حدث خطأ أثناء حفظ التغييرات. يرجى المحاولة مرة أخرى.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // --- نسخ احتياطي للتصميم ---
  const handleResetDesign = () => {
    showAlert(
      "استعادة الإعدادات",
      "هل تريد استعادة الإعدادات الافتراضية؟ سيتم فقدان جميع التغييرات غير المحفوظة.",
      "warning",
      () => {
        setPageData({
          ...pageData,
          theme_config: {
            template_id: "simple",
            font_family: "Tajawal",
            font_size: "normal",
            primary: "#3B82F6",
            brand_name: project.title,
          }
        });
        showAlert("تم الاستعادة", "تم استعادة الإعدادات الافتراضية بنجاح.", "success");
      }
    );
  };

  // --- التحقق من نوع الحقل عند التغيير ---
  const handleFieldTypeChange = (index, value) => {
    if (value === "IMAGE_VOTE" && !isPro) {
      showAlert(
        "ميزة للمحترفين",
        "ميزة التصويت بالصور متاحة فقط في باقة المحترفين. قم بالترقية للوصول إلى هذه الميزة والمزيد.",
        "info"
      );
      return;
    }
    handleUpdateQuestion(index, "field_type", value);
  };

  // --- حالات التحميل ---
  if (!project.landing_page_slug) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FaGlobe className="text-blue-600 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">لم يتم إنشاء الصفحة بعد</h3>
          <p className="text-gray-600 text-sm mb-6">
            يجب إنشاء صفحة الهبوط أولاً من خلال مرحلة الاستراتيجية.
          </p>
        </div>
      </div>
    );
  }

  if (loading || !pageData) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">جاري تحميل مصمم الصفحة...</p>
        </div>
      </div>
    );
  }

  // --- الثوابت والخيارات ---
  const COLORS_FREE = [
    { name: "أزرق محيط", value: "#3B82F6" },
    { name: "بنفسجي", value: "#8B5CF6" },
    { name: "أخضر زمردي", value: "#10B981" },
  ];

  const COLORS_PRO = [
    { name: "أزرق داكن", value: "#1E40AF" },
    { name: "بنفسجي ملكي", value: "#7C3AED" },
    { name: "أحمر كرزي", value: "#DC2626" },
    { name: "أسود كلاسيكي", value: "#111827" },
    { name: "برتقالي ناري", value: "#EA580C" },
  ];

  const FONT_OPTIONS = [
    { id: "Tajawal", name: "تجوال", category: "عربي" },
    { id: "Cairo", name: "كايرو", category: "عربي" },
    { id: "IBM Plex Sans Arabic", name: "IBM Plex", category: "عربي" },
    { id: "Inter", name: "إنتر", category: "لاتيني" },
  ];

  const TEMPLATES = [
    { 
      id: "simple", 
      name: "بسيط وأنيق", 
      description: "تصميم نظيف مع تركيز على المحتوى",
      type: "FREE",
      icon: "🔄"
    },
    { 
      id: "modern", 
      name: "عصري وجريء", 
      description: "تصميم معاصر مع تأثيرات مرئية",
      type: "PRO",
      icon: "⚡"
    },
    { 
      id: "professional", 
      name: "احترافي", 
      description: "مظهر رسمي وموثوق",
      type: "PRO",
      icon: "👔"
    },
  ];

  return (
  <>      <AlertDialog
        isOpen={alertDialog.isOpen}
        onClose={closeAlert}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
        onConfirm={alertDialog.onConfirm}
        showCancel={alertDialog.type === "warning"}
        confirmText={alertDialog.type === "warning" ? "نعم، متأكد" : "موافق"}
        cancelText="إلغاء"
      />

      {/* المحتوى الرئيسي */}
      <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-blue-50/30">
        {/* شريط التحكم العلوي */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FaBrush className="text-white text-sm" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">مصمم الصفحة</h2>
                  <p className="text-xs text-gray-500">{project.title}</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("design")}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all ${activeTab === "design" ? "bg-white shadow text-blue-600" : "text-gray-600 hover:text-gray-800"}`}
                >
                  <FaPalette className="inline mr-2" />
                  التصميم
                </button>
                <button
                  onClick={() => setActiveTab("content")}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all ${activeTab === "content" ? "bg-white shadow text-blue-600" : "text-gray-600 hover:text-gray-800"}`}
                >
                  <FaHeading className="inline mr-2" />
                  المحتوى
                </button>
                <button
                  onClick={() => setActiveTab("form")}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all ${activeTab === "form" ? "bg-white shadow text-blue-600" : "text-gray-600 hover:text-gray-800"}`}
                >
                  <FaQuestionCircle className="inline mr-2" />
                  النموذج
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleResetDesign}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <FaUndo />
                <span className="hidden md:inline">استعادة</span>
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewMode("mobile")}
                  className={`p-2 rounded-lg ${previewMode === "mobile" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                  title="عرض الجوال"
                >
                  <FaMobileAlt />
                </button>
                <button
                  onClick={() => setPreviewMode("desktop")}
                  className={`p-2 rounded-lg ${previewMode === "desktop" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                  title="عرض الكمبيوتر"
                >
                  <FaDesktop />
                </button>
              </div>

              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <FaSave />
                    حفظ
                  </>
                )}
              </Button>

              <a
                href={`/p/${pageData.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                title="فتح في نافذة جديدة"
              >
                <FaExternalLinkAlt />
              </a>
            </div>
          </div>

          {/* شريط التبويب للجوال */}
          <div className="flex md:hidden gap-2 mt-3 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab("design")}
              className={`px-3 py-2 rounded text-sm font-medium whitespace-nowrap ${activeTab === "design" ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
            >
              التصميم
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`px-3 py-2 rounded text-sm font-medium whitespace-nowrap ${activeTab === "content" ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
            >
              المحتوى
            </button>
            <button
              onClick={() => setActiveTab("form")}
              className={`px-3 py-2 rounded text-sm font-medium whitespace-nowrap ${activeTab === "form" ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
            >
              النموذج
            </button>
          </div>
        </div>

  {/* --- المحتوى الرئيسي --- */}
       <div className="flex-1 flex overflow-hidden">
        {/* --- شريط أدوات التصميم --- */}
         {activeTab === "design" && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-1">
                إعدادات التصميم
              </h3>
              <p className="text-xs text-gray-500">قم بتخصيص مظهر صفحتك</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* الألوان */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">الألوان</h4>
                  <FaPalette className="text-gray-400 text-sm" />
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-3">الألوان الأساسية</p>
                  <div className="grid grid-cols-5 gap-3">
                    {COLORS_FREE.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleThemeChange(color.value, false)}
                        className="group relative"
                      >
                        <div
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${
                            pageData.theme_config?.primary === color.value
                              ? "border-blue-500 scale-105 shadow-md"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          style={{ backgroundColor: color.value }}
                        />
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                          {color.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-gray-600">ألوان احترافية</p>
                    {!isPro && (
                      <span className="text-xs bg-gradient-to-r from-yellow-50 to-orange-50 text-amber-700 px-2 py-1 rounded-full flex items-center gap-1">
                        <FaCrown className="text-xs" />
                        Pro
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {COLORS_PRO.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleThemeChange(color.value, true)}
                        className={`group relative ${
                          !isPro ? "opacity-60" : ""
                        }`}
                        disabled={!isPro}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${
                            pageData.theme_config?.primary === color.value
                              ? "border-blue-500 scale-105 shadow-md"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          style={{ backgroundColor: color.value }}
                        />
                        {!isPro && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FaLock className="text-white/80 text-xs drop-shadow" />
                          </div>
                        )}
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                          {color.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* القوالب */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">
                    قوالب التصميم
                  </h4>
                  <FaLayerGroup className="text-gray-400 text-sm" />
                </div>

                <div className="space-y-3">
                  {TEMPLATES.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateChange(template)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        pageData.theme_config.template_id === template.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      } ${
                        template.type === "PRO" && !isPro ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{template.icon}</span>
                          <span className="text-sm font-medium text-gray-800">
                            {template.name}
                          </span>
                        </div>
                        {template.type === "PRO" && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              isPro
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {isPro ? (
                              "Pro"
                            ) : (
                              <FaLock className="inline" size={10} />
                            )}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">
                        {template.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* الخطوط */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">الخطوط</h4>
                  <FaFont className="text-gray-400 text-sm" />
                </div>

                <div className="space-y-3">
                  {FONT_OPTIONS.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => handleConfigChange("font_family", font.id)}
                      className={`w-full p-3 rounded-lg border text-right transition-all ${
                        pageData.theme_config?.font_family === font.id
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                      }`}
                      style={{ fontFamily: font.id }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {font.category}
                        </span>
                        <span className="text-sm font-medium">{font.name}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-xs text-gray-600 mb-2 block">
                    حجم الخط
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["صغير", "متوسط", "كبير"].map((size, index) => (
                      <button
                        key={size}
                        onClick={() =>
                          handleConfigChange(
                            "font_size",
                            ["small", "normal", "large"][index]
                          )
                        }
                        className={`py-2 rounded-lg border text-sm transition-all ${
                          pageData.theme_config?.font_size ===
                          ["small", "normal", "large"][index]
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- محتوى المحرر --- */}
        {activeTab === "content" && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-1">المحتوى</h3>
              <p className="text-xs text-gray-500">
                عدل النصوص والعناصر الرئيسية
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    العنوان الرئيسي
                  </label>
                  <textarea
                    name="main_headline"
                    value={pageData.main_headline}
                    onChange={handleChange}
                    rows="2"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-lg font-medium"
                    placeholder="اكتب العنوان الرئيسي..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    الوصف
                  </label>
                  <textarea
                    name="sub_headline"
                    value={pageData.sub_headline}
                    onChange={handleChange}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                    placeholder="اكتب وصف صفحتك..."
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaMagic className="text-blue-600" />
                  <h4 className="text-sm font-medium text-blue-800">
                    اقتراحات ذكية
                  </h4>
                </div>
                <p className="text-xs text-blue-600 mb-3">
                  استخدم لغة واضحة وجذابة تشرح قيمة مشروعك للزوار
                </p>
                <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
                  توليد نص ذكي
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- محتوى النموذج --- */}
        {activeTab === "form" && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-800">النموذج</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {pageData.questions.length} سؤال
                </span>
              </div>
              <p className="text-xs text-gray-500">
                أضف أسئلة لجمع بيانات الزوار
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4 mb-6">
                {pageData.questions.map((q, idx) => (
                  <div
                    key={q.id || q.tempId}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <input
                          value={q.question_text}
                          onChange={(e) =>
                            handleUpdateQuestion(
                              idx,
                              "question_text",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border-b border-gray-200 focus:border-blue-500 focus:outline-none text-sm font-medium text-gray-800"
                          placeholder="نص السؤال"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteQuestion(idx)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-600 mb-2 block">
                          نوع الإجابة
                        </label>
                        <select
                          value={q.field_type}
                          onChange={(e) => {
                            if (e.target.value === "IMAGE_VOTE" && !isPro) {
                              alert("ميزة التصويت بالصور متاحة للمحترفين فقط");
                              return;
                            }
                            handleUpdateQuestion(
                              idx,
                              "field_type",
                              e.target.value
                            );
                          }}
                          className="w-full p-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                        >
                          <option value="TEXT">نص قصير</option>
                          <option value="CHOICE">اختيار من متعدد</option>
                          <option value="IMAGE_VOTE">تصويت بالصور</option>
                        </select>
                      </div>

                      {q.field_type === "CHOICE" && (
                        <div>
                          <label className="text-xs text-gray-600 mb-2 block">
                            الخيارات
                          </label>
                          <input
                            placeholder="أحمر، أخضر، أزرق"
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                            onChange={(e) =>
                              handleUpdateQuestion(
                                idx,
                                "options",
                                e.target.value.split("،").map((s) => s.trim())
                              )
                            }
                          />
                        </div>
                      )}

                      {q.field_type === "IMAGE_VOTE" && (
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-gray-600 mb-2 block">
                              صورة A
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                className="flex-1 text-sm"
                                onChange={(e) =>
                                  handleUpdateQuestion(
                                    idx,
                                    "image_a",
                                    e.target.files[0]
                                  )
                                }
                                disabled={!isPro}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-600 mb-2 block">
                              صورة B
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                className="flex-1 text-sm"
                                onChange={(e) =>
                                  handleUpdateQuestion(
                                    idx,
                                    "image_b",
                                    e.target.files[0]
                                  )
                                }
                                disabled={!isPro}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={q.required}
                            onChange={(e) =>
                              handleUpdateQuestion(
                                idx,
                                "required",
                                e.target.checked
                              )
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          إجباري
                        </label>
                        <span className="text-xs text-gray-400">
                          #{idx + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddQuestion}
                className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2 font-medium"
              >
                <FaPlus />
                إضافة سؤال جديد
              </button>

              {!isPro && pageData.questions.length >= 3 && (
                <div className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCrown className="text-amber-600" />
                    <h4 className="text-sm font-medium text-amber-800">
                      ترقية إلى Pro
                    </h4>
                  </div>
                  <p className="text-xs text-amber-700 mb-3">
                    قم بالترقية لإضافة المزيد من الأسئلة والوصول إلى جميع
                    الميزات
                  </p>
                  <button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-medium py-2 rounded-lg hover:shadow-md transition">
                    ترقية الآن
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- منطقة المعاينة الرئيسية --- */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-auto">
          <div className="relative">
            {/* إطار المعاينة */}
            <div
              className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ${
                previewMode === "mobile" ? "w-[360px]" : "w-full max-w-6xl"
              }`}
            >
              {/* شريط حالة الجوال */}
              {previewMode === "mobile" && (
                <div className="h-6 bg-gradient-to-r from-gray-800 to-gray-900 relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-xs">
                    9:41
                  </div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
                    <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
                    <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-500 rounded-full"></div>
                  </div>
                </div>
              )}

              {/* محتوى الصفحة */}
              <div
                className={`overflow-y-auto ${
                  previewMode === "mobile" ? "h-[640px]" : "max-h-[80vh]"
                }`}
                style={{ fontFamily: pageData.theme_config.font_family }}
              >
                {/* الهيدر */}
                <div
                  className={`${
                    pageData.theme_config.template_id === "simple"
                      ? "bg-gradient-to-br from-blue-600 to-blue-700"
                      : "bg-white"
                  } p-6 md:p-12`}
                >
                  <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-8">
                      <div
                        className={`text-lg font-bold ${
                          pageData.theme_config.template_id === "simple"
                            ? "text-white/90"
                            : "text-gray-900"
                        }`}
                        style={
                          pageData.theme_config.template_id !== "simple"
                            ? { color: pageData.theme_config.primary }
                            : {}
                        }
                      >
                        {pageData.theme_config.brand_name}
                      </div>
                      {pageData.theme_config.template_id !== "simple" && (
                        <button
                          className="px-4 py-2 rounded-lg text-sm font-medium transition hover:shadow-md"
                          style={{
                            backgroundColor: pageData.theme_config.primary,
                            color: "white",
                          }}
                        >
                          تجربة مجانية
                        </button>
                      )}
                    </div>

                    <div
                      className={`text-center ${
                        pageData.theme_config.template_id === "simple"
                          ? ""
                          : "text-right"
                      }`}
                    >
                      <h1
                        className={`font-bold leading-tight mb-4 ${
                          pageData.theme_config.template_id === "simple"
                            ? "text-white"
                            : "text-gray-900"
                        }
                        ${
                          pageData.theme_config.font_size === "large"
                            ? "text-4xl md:text-5xl"
                            : pageData.theme_config.font_size === "small"
                            ? "text-2xl md:text-3xl"
                            : "text-3xl md:text-4xl"
                        }`}
                      >
                        {pageData.main_headline}
                      </h1>

                      <p
                        className={`mb-8 ${
                          pageData.theme_config.template_id === "simple"
                            ? "text-white/90"
                            : "text-gray-600"
                        }
                        ${
                          pageData.theme_config.font_size === "large"
                            ? "text-lg"
                            : pageData.theme_config.font_size === "small"
                            ? "text-sm"
                            : "text-base"
                        }`}
                      >
                        {pageData.sub_headline}
                      </p>

                      <button
                        className={`px-8 py-3 rounded-lg font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl
                        ${
                          pageData.theme_config.template_id === "simple"
                            ? "bg-white text-blue-600"
                            : "text-white"
                        }`}
                        style={
                          pageData.theme_config.template_id !== "simple"
                            ? { backgroundColor: pageData.theme_config.primary }
                            : {}
                        }
                      >
                        {pageData.theme_config.template_id === "simple"
                          ? "ابدأ الآن"
                          : "سجل اهتمامك"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* نموذج التسجيل */}
                <div className="p-6 md:p-12 bg-gradient-to-b from-white to-gray-50">
                  <div className="container mx-auto max-w-2xl">
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                      <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaShieldAlt className="text-blue-600 text-xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          سجل معلوماتك
                        </h3>
                        <p className="text-gray-600">املأ النموذج للمتابعة</p>
                      </div>

                      <div className="space-y-4">
                        {/* حقل البريد الإلكتروني */}
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            البريد الإلكتروني
                          </label>
                          <input
                            type="email"
                            placeholder="example@email.com"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            disabled
                          />
                        </div>

                        {/* الأسئلة الديناميكية */}
                        {pageData.questions.map((q, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium text-gray-700">
                                {q.question_text}
                              </label>
                              {q.required && (
                                <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
                                  إجباري
                                </span>
                              )}
                            </div>

                            {q.field_type === "TEXT" && (
                              <input
                                type="text"
                                placeholder="اكتب إجابتك هنا..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                disabled
                              />
                            )}

                            {q.field_type === "CHOICE" && (
                              <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                disabled
                              >
                                <option>اختر من القائمة...</option>
                                {q.options?.map((option, i) => (
                                  <option key={i}>{option}</option>
                                ))}
                              </select>
                            )}

                            {q.field_type === "IMAGE_VOTE" && (
                              <div className="grid grid-cols-2 gap-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 cursor-pointer transition">
                                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <FaImage className="text-blue-600" />
                                  </div>
                                  <span className="text-sm text-gray-600">
                                    صورة A
                                  </span>
                                </div>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 cursor-pointer transition">
                                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <FaImage className="text-blue-600" />
                                  </div>
                                  <span className="text-sm text-gray-600">
                                    صورة B
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 mt-6">
                          إرسال النموذج
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-4">
                          بمواصلة النموذج، أنت توافق على{" "}
                          <a href="#" className="text-blue-600 hover:underline">
                            شروط الخدمة
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* شريط حالة المعاينة */}
            <div className="mt-4 flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-gray-600">المعاينة مباشرة</span>
              </div>
              <div className="text-xs text-gray-500">
                {previewMode === "mobile" ? "عرض الجوال" : "عرض الكمبيوتر"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>);

};
export default BuilderStage;