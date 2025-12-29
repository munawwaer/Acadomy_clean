import { useEffect, useState } from "react";
import { useParams, NavLink, Outlet, useNavigate } from "react-router-dom";
import client from "../../api/client";
import {
  FaChartPie,
  FaBrain,
  FaPaintBrush,
  FaUsers,
  FaArrowRight,
  FaExternalLinkAlt,
} from "react-icons/fa";

const ProjectWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    try {
      const response = await client.get(`/v1/projects/${id}/`);
      setProject(response.data);
    } catch (error) {
      console.error("Error:", error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (loading)
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        جاري التحميل...
      </div>
    );

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-gray-100">
      {/* --- الشريط المدمج (TabBar Style) --- */}
      {/* جعلناه بارتفاع ثابت h-14 وخلفية بيضاء مع ظل خفيف */}
      <div className="bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 h-14 flex-shrink-0 z-20">
        {/* 1. القسم الأيمن: زر العودة + العنوان */}
        <div className="flex items-center gap-4 h-full">
          <button
            onClick={() => navigate("/projects")}
            className="text-gray-400 hover:text-navy hover:bg-gray-100 p-2 rounded-full transition"
            title="عودة للقائمة"
          >
            <FaArrowRight size={14} />
          </button>

          <div className="flex items-center gap-2 border-l border-gray-200 pl-4 h-8">
            <h1
              className="text-base font-bold text-navy truncate max-w-[200px]"
              title={project.title}
            >
              {project.title}
            </h1>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getStatusColor(
                project.stage
              )}`}
            >
              {project.stage_display}
            </span>
          </div>
        </div>

        {/* 2. القسم الأوسط: التبويبات (Tabs) */}
        {/* التبويبات تأخذ ارتفاع الشريط بالكامل h-full ليكون الخط السفلي ملاصقاً للحافة */}
        <div className="flex items-center h-full gap-1 overflow-x-auto no-scrollbar">
          <TabLink to="" icon={<FaChartPie size={14} />} label="التحليل" />
          <TabLink
            to="strategy"
            icon={<FaBrain size={14} />}
            label="الاستراتيجية"
            disabled={project.stage === "IDEA"}
          />
          <TabLink
            to="builder"
            icon={<FaPaintBrush size={14} />}
            label="البناء"
            disabled={
              !["STRATEGY_SET", "LANDING_PAGE", "PUBLISHED"].includes(
                project.stage
              )
            }
          />
          <TabLink
            to="leads"
            icon={<FaUsers size={14} />}
            label="النتائج"
            disabled={!project.landing_page_slug}
          />
        </div>

        {/* 3. القسم الأيسر: إجراءات إضافية (مثل المعاينة) */}
        <div className="flex items-center gap-2">
          {project.landing_page_slug && (
            <a
              href={`/p/${project.landing_page_slug}`}
              target="_blank"
              className="flex items-center gap-1 text-xs font-bold text-navy bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition"
            >
              <span>معاينة</span> <FaExternalLinkAlt size={10} />
            </a>
          )}
        </div>
      </div>

      {/* --- منطقة العمل (المحتوى) --- */}
      {/* قمنا بإلغاء الـ padding الكبير، وضعنا p-4 فقط ليكون المحتوى قريباً لكن غير ملتصق */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 scroll-smooth">
        <div className="max-w-7xl mx-auto min-h-full">
          <Outlet context={{ project, onUpdate: fetchProject }} />
        </div>
      </div>
    </div>
  );
};

// مكون التبويب (Slim Tab)
const TabLink = ({ to, icon, label, disabled }) => (
  <NavLink
    to={to}
    end={to === ""}
    className={({ isActive }) => `
            relative h-full flex items-center gap-2 px-4 transition-all duration-200 text-sm font-bold select-none border-b-[3px]
            ${
              disabled
                ? "text-gray-300 cursor-not-allowed border-transparent pointer-events-none grayscale"
                : isActive
                ? "border-navy text-navy bg-blue-50/50"
                : "border-transparent text-gray-500 hover:text-navy hover:bg-gray-50"
            }
        `}
  >
    <span className="mb-0.5">{icon}</span>
    <span className="whitespace-nowrap">{label}</span>
  </NavLink>
);

// ألوان الحالة (نفس السابق لكن مصغر)
const getStatusColor = (stage) => {
  switch (stage) {
    case "PUBLISHED":
      return "bg-green-100 text-green-700 border-green-200";
    case "IDEA":
      return "bg-gray-100 text-gray-600 border-gray-200";
    default:
      return "bg-blue-50 text-blue-700 border-blue-100";
  }
};

export default ProjectWorkspace;
// import { useEffect, useState } from "react";
// import { useParams, NavLink, Outlet, useNavigate } from "react-router-dom";
// import client from "../../api/client";
// import {
//   FaChartPie,
//   FaBrain,
//   FaPaintBrush,
//   FaUsers,
//   FaArrowRight,
//   FaChevronLeft,
// } from "react-icons/fa";

// const ProjectWorkspace = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchProject = async () => {
//     try {
//       const response = await client.get(`/v1/projects/${id}/`);
//       setProject(response.data);
//     } catch (error) {
//       console.error("Error:", error);
//       navigate("/dashboard");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProject();
//   }, [id]);

//   if (loading)
//     return (
//       <div className="h-screen flex items-center justify-center text-navy font-bold">
//         جاري تحميل مساحة العمل...
//       </div>
//     );

//   return (
//     <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
//       {/* --- المنطقة العلوية المدمجة (Header + Tabs) --- */}
//       <div className="bg-white border-b border-gray-200 shadow-sm z-20 flex-shrink-0">
//         {/* الصف الأول: العنوان والمسار */}
//         <div className="px-6 pt-4 pb-0">
//           {/* مسار التنقل وزر العودة */}
//           <div className="flex items-center gap-3 mb-3">
//             <button
//               onClick={() => navigate("/dashboard")}
//               className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-navy transition"
//               title="عودة للقائمة"
//             >
//               <FaArrowRight size={14} />
//             </button>

//             <nav className="flex items-center gap-2 text-xs font-medium text-gray-400">
//               <span
//                 className="hover:text-navy cursor-pointer"
//                 onClick={() => navigate("/dashboard")}
//               >
//                 مشاريعي
//               </span>
//               <FaChevronLeft size={8} />
//               <span className="text-navy bg-blue-50 px-2 py-0.5 rounded text-[10px] tracking-wide font-bold">
//                 {project.target_sector}
//               </span>
//             </nav>
//           </div>

//           {/* العنوان والحالة */}
//           <div className="flex justify-between items-end mr-11">
//             <div>
//               <h1 className="text-2xl font-black text-navy leading-none mb-4 flex items-center gap-3">
//                 {project.title}
//                 <span
//                   className={`text-xs px-2 py-1 rounded-full font-bold border ${getStatusColor(
//                     project.stage
//                   )}`}
//                 >
//                   {project.stage_display}
//                 </span>
//               </h1>
//             </div>

//             {/* زر معاينة خارجي (يظهر فقط إذا تم النشر) */}
//             {project.landing_page_slug && (
//               <a
//                 href={`/p/${project.landing_page_slug}`}
//                 target="_blank"
//                 className="text-xs font-bold text-gray-500 hover:text-navy mb-4 flex items-center gap-1"
//               >
//                 رابط الصفحة <FaChevronLeft size={8} />
//               </a>
//             )}
//           </div>
//         </div>

//         {/* الصف الثاني: التبويبات (مدمجة في نفس البوكس) */}
//         <div className="px-6 flex gap-6 overflow-x-auto mr-11">
//           <TabLink to="" icon={<FaChartPie />} label="التحليل" />
//           <TabLink
//             to="strategy"
//             icon={<FaBrain />}
//             label="الاستراتيجية"
//             disabled={project.stage === "IDEA"}
//           />
//           <TabLink
//             to="builder"
//             icon={<FaPaintBrush />}
//             label="البناء"
//             disabled={
//               !["STRATEGY_SET", "LANDING_PAGE", "PUBLISHED"].includes(
//                 project.stage
//               )
//             }
//           />
//           <TabLink
//             to="leads"
//             icon={<FaUsers />}
//             label="النتائج"
//             disabled={!project.landing_page_slug}
//           />
//         </div>
//       </div>

//       {/* --- منطقة العمل (المحتوى) --- */}
//       {/* h-full + overflow-auto يجعل التمرير هنا فقط وليس في الصفحة كلها */}
//       <div className="flex-1 overflow-y-auto bg-gray-100 p-6 scroll-smooth">
//         <div className="max-w-6xl mx-auto min-h-full">
//           {/* Outlet: هنا تظهر الصفحات (Analysis, Strategy, Builder...) */}
//           <Outlet context={{ project, onUpdate: fetchProject }} />
//         </div>
//       </div>
//     </div>
//   );
// };

// // مكون التبويبات (محسن)
// const TabLink = ({ to, icon, label, disabled }) => (
//   <NavLink
//     to={to}
//     end={to === ""}
//     className={({ isActive }) => `
//             group flex items-center gap-2 py-3 px-1 border-b-[3px] transition-all duration-200 font-bold text-sm select-none
//             ${
//               disabled
//                 ? "text-gray-300 cursor-not-allowed border-transparent pointer-events-none"
//                 : isActive
//                 ? "border-navy text-navy"
//                 : "border-transparent text-gray-500 hover:text-navy hover:border-gray-200"
//             }
//         `}
//   >
//     <span className="mb-0.5 text-lg group-hover:scale-110 transition-transform">
//       {icon}
//     </span>
//     <span>{label}</span>
//   </NavLink>
// );

// // دالة ألوان الحالة
// const getStatusColor = (stage) => {
//   switch (stage) {
//     case "PUBLISHED":
//       return "bg-green-100 text-green-700 border-green-200";
//     case "IDEA":
//       return "bg-gray-100 text-gray-600 border-gray-200";
//     default:
//       return "bg-blue-50 text-blue-700 border-blue-100";
//   }
// };

// export default ProjectWorkspace;
