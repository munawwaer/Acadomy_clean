// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import client from "../../api/client";
// import {
//   FaPlus,
//   FaRocket,
//   FaCheckCircle,
//   FaUsers,
//   FaArrowLeft,
// } from "react-icons/fa";

// const ProjectsList = () => {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({ total: 0, published: 0, totalLeads: 0 }); // حالة للإحصائيات

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const response = await client.get("/v1/projects/");
//         setProjects(response.data);

//         // حساب الإحصائيات محلياً (يمكن جلبها من الباك اند لاحقاً)
//         const publishedCount = response.data.filter(
//           (p) => p.stage === "PUBLISHED" || p.landing_page_slug
//         ).length;
//         // ملاحظة: هنا نفترض أننا سنجلب عدد العملاء لاحقاً، حالياً سنضعه 0 أو رقم عشوائي للتجربة
//         setStats({
//           total: response.data.length,
//           published: publishedCount,
//           totalLeads: 0, // يحتاج تعديل في الباك اند لجمعه
//         });
//       } catch (error) {
//         console.error("Error fetching projects:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProjects();
//   }, []);

//   if (loading)
//     return (
//       // Skeleton Loading (محاكاة التحميل بشكل احترافي)
//       <div className="space-y-6 animate-pulse">
//         <div className="flex gap-4">
//           <div className="h-32 bg-gray-200 rounded-xl flex-1"></div>
//           <div className="h-32 bg-gray-200 rounded-xl flex-1"></div>
//           <div className="h-32 bg-gray-200 rounded-xl flex-1"></div>
//         </div>
//         <div className="h-64 bg-gray-200 rounded-xl w-full"></div>
//       </div>
//     );

//   return (
//     <div className="space-y-8">
//       {/* 1. رأس الصفحة مع زر الإجراء */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-navy">لوحة التحكم العامة</h1>
//           <p className="text-gray-500 text-sm mt-1">
//             نظرة شاملة على أداء مشاريعك الريادية
//           </p>
//         </div>
//         <Link
//           to="/dashboard/new-project"
//           className="bg-navy hover:bg-navy-dark text-white py-2.5 px-6 rounded-lg flex items-center gap-2 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//         >
//           <FaPlus className="text-gold" /> مشروع جديد
//         </Link>
//       </div>

//       {/* 2. شريط الإحصائيات (KPI Cards) */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <StatCard
//           title="إجمالي المشاريع"
//           value={stats.total}
//           icon={<FaRocket />}
//           color="bg-blue-50 text-blue-600"
//         />
//         <StatCard
//           title="مشاريع جاهزة"
//           value={stats.published}
//           icon={<FaCheckCircle />}
//           color="bg-green-50 text-green-600"
//         />
//         <StatCard
//           title="إجمالي المهتمين (Leads)"
//           value="-" // سنربطه لاحقاً
//           icon={<FaUsers />}
//           color="bg-purple-50 text-purple-600"
//         />
//       </div>

//       {/* 3. قائمة المشاريع (Table View للرسمية أكثر) */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
//           <h3 className="font-bold text-navy">آخر المشاريع</h3>
//         </div>

//         {projects.length === 0 ? (
//           <div className="p-10 text-center text-gray-400">
//             لا يوجد مشاريع حتى الآن. ابدأ بإنشاء مشروعك الأول!
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-right">
//               <thead className="text-gray-500 text-xs uppercase font-bold bg-white border-b border-gray-100">
//                 <tr>
//                   <th className="px-6 py-4">اسم المشروع</th>
//                   <th className="px-6 py-4">القطاع</th>
//                   <th className="px-6 py-4">المرحلة</th>
//                   <th className="px-6 py-4">تاريخ الإنشاء</th>
//                   <th className="px-6 py-4"></th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {projects.map((project) => (
//                   <tr
//                     key={project.id}
//                     className="hover:bg-blue-50/50 transition group"
//                   >
//                     <td className="px-6 py-4 font-bold text-navy">
//                       {project.title}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       <span className="bg-gray-100 px-2 py-1 rounded text-xs border border-gray-200">
//                         {project.target_sector}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`text-xs px-2 py-1 rounded-full font-bold border ${getStatusColor(
//                           project.stage
//                         )}`}
//                       >
//                         {project.stage_display}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-400 font-mono">
//                       {new Date(project.created_at).toLocaleDateString("ar-EG")}
//                     </td>
//                     <td className="px-6 py-4 text-left">
//                       <Link
//                         to={`/dashboard/project/${project.id}`}
//                         className="text-navy hover:text-gold font-bold text-sm flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         إدارة <FaArrowLeft />
//                       </Link>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // مكون مساعد للبطاقات
// const StatCard = ({ title, value, icon, color }) => (
//   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition">
//     <div>
//       <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
//         {title}
//       </p>
//       <h3 className="text-3xl font-bold text-navy">{value}</h3>
//     </div>
//     <div
//       className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${color}`}
//     >
//       {icon}
//     </div>
//   </div>
// );

// // دالة مساعدة للألوان
// const getStatusColor = (stage) => {
//   switch (stage) {
//     case "PUBLISHED":
//       return "bg-green-50 text-green-700 border-green-100";
//     case "IDEA":
//       return "bg-gray-100 text-gray-600 border-gray-200";
//     default:
//       return "bg-blue-50 text-blue-700 border-blue-100";
//   }
// };

// export default ProjectsList;

// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import client from "../../api/client";
// import { FaPlus, FaSearch } from "react-icons/fa";

// const ProjectsList = () => {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // جلب المشاريع عند تحميل الصفحة
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const response = await client.get("/v1/projects/");
//         setProjects(response.data);
//       } catch (error) {
//         console.error("Error fetching projects:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProjects();
//   }, []);

//   if (loading)
//     return <div className="text-center mt-10">جاري تحميل مشاريعك...</div>;

//   return (
//     <div>
//       {/* رأس الصفحة */}
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-navy">مشاريعي الريادية</h1>
//           <p className="text-gray-500 text-sm mt-1">
//             إدارة وتحليل أفكارك في مكان واحد
//           </p>
//         </div>
//         <Link
//           to="/dashboard/new-project"
//           className="bg-gold hover:bg-gold-light text-navy-dark font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition shadow-lg cursor-pointer"
//         >
//           <FaPlus /> مشروع جديد
//         </Link>
//       </div>

//       {/* المحتوى */}
//       {projects.length === 0 ? (
//         // حالة: لا يوجد مشاريع (Empty State)
//         <div className="text-center py-20 bg-white rounded-xl shadow border border-gray-100">
//           <div className="text-6xl mb-4">🚀</div>
//           <h3 className="text-xl font-bold text-gray-700">
//             لا يوجد مشاريع حتى الآن
//           </h3>
//           <p className="text-gray-500 mb-6 max-w-md mx-auto mt-2">
//             ابدأ رحلتك الآن وقم بتحويل فكرتك إلى واقع باستخدام أدوات الذكاء
//             الاصطناعي.
//           </p>
//           <Link
//             to="/dashboard/new-project"
//             className="text-gold font-bold hover:underline"
//           >
//             + إنشاء أول مشروع
//           </Link>
//         </div>
//       ) : (
//         // حالة: عرض المشاريع (Grid)
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {projects.map((project) => (
//             <div
//               key={project.id}
//               className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 p-6 flex flex-col h-full group"
//             >
//               <div className="flex justify-between items-start mb-4">
//                 <h3 className="text-lg font-bold text-navy group-hover:text-gold transition-colors">
//                   {project.title}
//                 </h3>
//                 {/* عرض المرحلة (Status Badge) */}
//                 <span
//                   className={`text-xs px-2 py-1 rounded-full font-bold
//                         ${
//                           project.stage === "IDEA"
//                             ? "bg-gray-200 text-gray-600"
//                             : project.stage === "PUBLISHED"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-blue-100 text-blue-700"
//                         }`}
//                 >
//                   {project.stage_display || project.stage}
//                 </span>
//               </div>

//               <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-1">
//                 {project.raw_description}
//               </p>

//               <div className="pt-4 border-t border-gray-100 mt-auto">
//                 <Link
//                   to={`/dashboard/project/${project.id}`}
//                   className="text-sm font-bold text-navy hover:text-gold flex items-center gap-1 justify-end"
//                 >
//                   فتح مساحة العمل &larr;
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectsList;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../../api/client";
import {
  FaPlus,
  FaEye,
  FaUserFriends,
  FaChevronLeft,
  FaRocket,
} from "react-icons/fa";

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await client.get("/v1/projects/");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const calculateProgress = (signups) => {
    const target = 40; // الهدف
    return Math.min(((signups || 0) / target) * 100, 100);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
      </div>
    );

  return (
    // أضفنا p-8 لإبعاد المحتوى عن الحواف
    <div className="animate-fade-in p-6 md:p-8">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy flex items-center gap-2">
            <FaRocket className="text-gold" /> مشاريعي
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            نظرة عامة على تقدم أفكارك
          </p>
        </div>
        <Link
          to="/new-project"
          className="bg-gold hover:bg-yellow-500 text-navy-dark text-sm font-bold py-2 px-5 rounded-lg flex items-center gap-2 transition shadow-md hover:shadow-lg"
        >
          <FaPlus size={12} /> مشروع جديد
        </Link>
      </div>

      {/* المحتوى */}
      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">ابدأ رحلتك</h3>
          <p className="text-gray-500 mb-6 text-xs">أنشئ مشروعك الأول الآن</p>
          <Link
            to="/new-project"
            className="text-white bg-navy hover:bg-navy-dark px-5 py-2.5 rounded-lg text-sm font-bold shadow-md"
          >
            إنشاء مشروع
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {projects.map((project) => {
            const views = project.landing_page?.views_count || 0;
            const leads = project.landing_page?.current_signups || 0;
            const progress = calculateProgress(leads);

            return (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-4 flex flex-col h-full group relative"
              >
                {/* 1. العنوان والحالة */}
                <div className="flex justify-between items-start mb-2">
                  <h3
                    className="text-base font-bold text-navy group-hover:text-gold transition-colors line-clamp-1"
                    title={project.title}
                  >
                    {project.title}
                  </h3>
                  <StatusBadge
                    stage={project.stage}
                    label={project.stage_display}
                  />
                </div>

                {/* 2. الوصف المختصر */}
                <p className="text-gray-400 text-[11px] mb-4 line-clamp-2 leading-relaxed h-8">
                  {project.raw_description || "لا يوجد وصف."}
                </p>

                {/* 3. شريط التقدم الصغير */}
                <div className="mb-4">
                  <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-green-500 h-1 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* 4. التذييل: زر الدخول + الأيقونات */}
                <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-50">
                  {/* زر الدخول */}
                  <Link
                    to={`/project/${project.id}`}
                    className="text-xs font-bold text-navy bg-blue-50 hover:bg-navy hover:text-white px-3 py-1.5 rounded-md transition flex items-center gap-1"
                  >
                    فتح <FaChevronLeft size={8} />
                  </Link>

                  {/* الإحصائيات (أيقونات فقط) */}
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <div
                      className="flex items-center gap-1 text-gray-400"
                      title="عدد الزوار"
                    >
                      <FaEye className="text-gray-300" />
                      <span>{views}</span>
                    </div>
                    <div
                      className="flex items-center gap-1 text-green-600"
                      title="عدد المهتمين"
                    >
                      <FaUserFriends className="text-green-500" />
                      <span>{leads}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// شارة الحالة (صغيرة)
const StatusBadge = ({ stage, label }) => {
  let colors = "bg-gray-100 text-gray-500";
  if (stage === "PUBLISHED")
    colors = "bg-green-50 text-green-600 border border-green-100";
  if (stage === "STRATEGY_SET")
    colors = "bg-blue-50 text-blue-600 border border-blue-100";
  if (stage === "LANDING_PAGE")
    colors = "bg-purple-50 text-purple-600 border border-purple-100";

  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${colors}`}>
      {label || stage}
    </span>
  );
};

export default ProjectsList;
