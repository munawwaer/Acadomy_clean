import { useState, useEffect, useMemo } from "react";
import client from "../../../api/client";
import {
  FaUser,
  FaEnvelope,
  FaClock,
  FaDownload,
  FaSearch,
  FaEye,
  FaTimes,
  FaImage,
  FaChartLine,
  FaPercentage,
} from "react-icons/fa";
// استيراد مكتبة الرسوم البيانية
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const LeadsStage = ({ project }) => {
  const [leads, setLeads] = useState([]);
  const [pageStats, setPageStats] = useState({ views: 0, signups: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (project.landing_page_slug) {
        try {
          // 1. جلب إحصائيات الصفحة (للزيارات)
          const pageRes = await client.get(
            `/v1/launchpad/pages/${project.landing_page_slug}/`
          );

          // 2. جلب قائمة العملاء (للتفاصيل والجدول)
          // ملاحظة: نفترض وجود هذا المسار، أو يمكن استخدام العلاقة
          const leadsRes = await client.get(
            `/v1/launchpad/leads/?landing_page=${pageRes.data.id}`
          );

          setLeads(leadsRes.data);
          setPageStats({
            views: pageRes.data.views_count || 0,
            signups: leadsRes.data.length,
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [project]);

  // --- حسابات الرسوم البيانية ---

  // 1. معدل التحويل (Conversion Rate)
  const conversionRate = useMemo(() => {
    if (pageStats.views === 0) return 0;
    return ((pageStats.signups / pageStats.views) * 100).toFixed(1);
  }, [pageStats]);

  // 2. تجهيز بيانات الرسم البياني (Leads over time)
  const chartData = useMemo(() => {
    // تجميع العملاء حسب التاريخ
    const grouped = {};
    leads.forEach((lead) => {
      const date = new Date(lead.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      grouped[date] = (grouped[date] || 0) + 1;
    });

    // تحويلها لمصفوفة للرسم
    return Object.keys(grouped)
      .map((date) => ({
        name: date,
        leads: grouped[date],
      }))
      .slice(-7); // آخر 7 أيام فقط
  }, [leads]);

  // 3. بيانات الرسم الدائري (Funnel)
  const pieData = [
    { name: "سجلوا اهتمامهم", value: pageStats.signups, color: "#10B981" }, // أخضر
    {
      name: "غادروا بدون تسجيل",
      value: Math.max(0, pageStats.views - pageStats.signups),
      color: "#E5E7EB",
    }, // رمادي
  ];

  // دالة التصدير
  const handleExport = () => {
    if (leads.length === 0) return alert("لا توجد بيانات للتصدير");
    let csvContent = "data:text/csv;charset=utf-8,Name,Email,Date,Answers\n";
    leads.forEach((lead) => {
      const answersStr = JSON.stringify(lead.answers_data || {}).replace(
        /,/g,
        ";"
      );
      csvContent += `${lead.name},${lead.email},${new Date(
        lead.created_at
      ).toLocaleDateString()},${answersStr}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_${project.title}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  if (!project.landing_page_slug)
    return (
      <div className="p-10 text-center text-gray-400">
        لم يتم نشر الصفحة بعد.
      </div>
    );
  if (loading)
    return (
      <div className="p-10 text-center text-navy font-bold">
        جاري تحليل البيانات...
      </div>
    );

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* 1. بطاقات الأداء الرئيسية (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* بطاقة الزوار */}
        <StatCard
          title="عدد الزيارات (Views)"
          value={pageStats.views}
          icon={<FaEye />}
          color="bg-blue-50 text-blue-600"
          subText="إجمالي من فتح الرابط"
        />
        {/* بطاقة المهتمين */}
        <StatCard
          title="العملاء المهتمين (Leads)"
          value={pageStats.signups}
          icon={<FaUser />}
          color="bg-green-50 text-green-600"
          subText="قاموا بتعبئة النموذج"
        />
        {/* بطاقة معدل التحويل */}
        <StatCard
          title="معدل التحويل (Success Rate)"
          value={`${conversionRate}%`}
          icon={<FaPercentage />}
          color="bg-purple-50 text-purple-600"
          subText="نسبة نجاح الحملة"
        />
      </div>

      {/* 2. قسم الرسوم البيانية (Charts Section) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-80">
        {/* الرسم البياني الخطي (النمو) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
            <FaChartLine className="text-gold" /> نمو المسجلين (آخر 7 أيام)
          </h3>
          <div className="flex-1 w-full min-h-0">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="leads"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorLeads)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                لا توجد بيانات كافية للرسم حتى الآن
              </div>
            )}
          </div>
        </div>

        {/* الرسم الدائري (نسبة النجاح) */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-navy mb-4 text-center">
            أداء القمع (Funnel)
          </h3>
          <div className="flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* النص في الوسط */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-navy">
                {conversionRate}%
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase">
                نسبة النجاح
              </span>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div> مسجلين
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div> زوار فقط
            </div>
          </div>
        </div>
      </div>

      {/* 3. جدول البيانات وتصدير CSV (نفس السابق مع تحسينات طفيفة) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-navy flex items-center gap-2">
            <FaEnvelope className="text-gray-400" /> تفاصيل المسجلين
          </h3>
          <button
            onClick={handleExport}
            className="text-xs bg-navy text-white px-3 py-1.5 rounded-lg hover:bg-navy-dark flex items-center gap-2 transition"
          >
            <FaDownload /> تصدير Excel
          </button>
        </div>

        {leads.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            لا يوجد مسجلين حتى الآن.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="text-gray-500 text-xs uppercase font-bold bg-white border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">الاسم</th>
                  <th className="px-6 py-4">البريد</th>
                  <th className="px-6 py-4">التاريخ</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-blue-50/30 transition">
                    <td className="px-6 py-4 font-bold text-navy text-sm">
                      {lead.name || "زائر"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {lead.email}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {new Date(lead.created_at).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="px-6 py-4 text-left">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="text-navy bg-gray-100 hover:bg-gold hover:text-white p-2 rounded-full transition"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* نافذة التفاصيل (Modal) */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative">
            <div className="bg-navy p-5 flex justify-between items-center text-white">
              <h3 className="font-bold">{selectedLead.name}</h3>
              <button onClick={() => setSelectedLead(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {Object.entries(selectedLead.answers_data || {}).map(
                ([k, v], i) => (
                  <div
                    key={i}
                    className="bg-gray-50 p-3 rounded border border-gray-100"
                  >
                    <p className="text-xs text-gray-400 font-bold mb-1">{k}</p>
                    <p className="font-bold text-navy text-sm">
                      {v === "image_a" || v === "image_b" ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <FaImage /> تصويت صورة
                        </span>
                      ) : (
                        v
                      )}
                    </p>
                  </div>
                )
              )}
              {(!selectedLead.answers_data ||
                Object.keys(selectedLead.answers_data).length === 0) && (
                <p className="text-center text-gray-400">
                  لا توجد إجابات إضافية.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// مكون البطاقة (Stat Card)
const StatCard = ({ title, value, icon, color, subText }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition">
    <div>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
        {title}
      </p>
      <h3 className="text-3xl font-black text-navy">{value}</h3>
      <p className="text-[10px] text-gray-400 mt-1">{subText}</p>
    </div>
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}
    >
      {icon}
    </div>
  </div>
);

export default LeadsStage;
// import { useState, useEffect } from "react";
// import client from "../../../api/client";
// import {
//   FaUsers,
//   FaEye,
//   FaPercentage,
//   FaFileCsv,
//   FaDownload,
// } from "react-icons/fa";

// const LeadsStage = ({ project }) => {
//   const [loading, setLoading] = useState(true);
//   const [leads, setLeads] = useState([]);
//   const [pageStats, setPageStats] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!project.landing_page_slug) {
//         setLoading(false);
//         return;
//       }

//       try {
//         // 1. جلب إحصائيات الصفحة (الزيارات)
//         const pageRes = await client.get(
//           `/v1/launchpad/pages/${project.landing_page_slug}/`
//         );
//         setPageStats(pageRes.data);

//         // 2. جلب قائمة المسجلين (لصفحتنا فقط)
//         // ملاحظة: نستخدم pageRes.data.id لضمان الدقة
//         const leadsRes = await client.get(
//           `/v1/launchpad/leads/?landing_page=${pageRes.data.id}`
//         );
//         setLeads(leadsRes.data);
//       } catch (err) {
//         console.error("Error loading leads", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [project]);

//   // تصدير البيانات (محاكاة)
//   const handleExport = () => {
//     const csvContent =
//       "data:text/csv;charset=utf-8," +
//       "Name,Email,Date\n" +
//       leads.map((l) => `${l.name},${l.email},${l.created_at}`).join("\n");
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", `leads_${project.title}.csv`);
//     document.body.appendChild(link);
//     link.click();
//   };

//   if (!project.landing_page_slug)
//     return (
//       <div className="p-10 text-center">
//         لم يتم نشر الصفحة بعد لجلب النتائج.
//       </div>
//     );
//   if (loading)
//     return <div className="p-10 text-center">جاري جلب الأرقام...</div>;

//   // حساب معدل التحويل (Signups / Views)
//   const views = pageStats?.views_count || 0;
//   const signups = leads.length;
//   const conversionRate = views > 0 ? ((signups / views) * 100).toFixed(1) : 0;

//   return (
//     <div className="space-y-8 animate-fade-in">
//       {/* 1. بطاقات الإحصائيات (KPIs) */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* بطاقة الزيارات */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
//           <div>
//             <p className="text-gray-500 text-sm font-bold mb-1">
//               عدد الزيارات (Views)
//             </p>
//             <h3 className="text-3xl font-bold text-navy">{views}</h3>
//           </div>
//           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl">
//             <FaEye />
//           </div>
//         </div>

//         {/* بطاقة المسجلين */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
//           <div>
//             <p className="text-gray-500 text-sm font-bold mb-1">
//               المهتمون (Leads)
//             </p>
//             <h3 className="text-3xl font-bold text-navy">{signups}</h3>
//           </div>
//           <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-xl">
//             <FaUsers />
//           </div>
//         </div>

//         {/* بطاقة نسبة النجاح */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
//           <div>
//             <p className="text-gray-500 text-sm font-bold mb-1">معدل التحويل</p>
//             <h3
//               className={`text-3xl font-bold ${
//                 conversionRate > 10 ? "text-green-600" : "text-orange-500"
//               }`}
//             >
//               {conversionRate}%
//             </h3>
//           </div>
//           <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-xl">
//             <FaPercentage />
//           </div>
//         </div>
//       </div>

//       {/* 2. جدول البيانات */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="p-6 border-b border-gray-100 flex justify-between items-center">
//           <h3 className="font-bold text-navy text-lg">
//             قائمة العملاء المحتملين
//           </h3>
//           {leads.length > 0 && (
//             <button
//               onClick={handleExport}
//               className="flex items-center gap-2 text-sm bg-navy text-white px-4 py-2 rounded hover:bg-navy-dark transition"
//             >
//               <FaDownload /> تصدير CSV
//             </button>
//           )}
//         </div>

//         {leads.length === 0 ? (
//           <div className="p-10 text-center text-gray-400">
//             لا يوجد تسجيلات حتى الآن. شارك رابط صفحتك لتبدأ في جمع العملاء!
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-right">
//               <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
//                 <tr>
//                   <th className="p-4">الاسم</th>
//                   <th className="p-4">البريد الإلكتروني</th>
//                   <th className="p-4">تاريخ التسجيل</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {leads.map((lead) => (
//                   <tr key={lead.id} className="hover:bg-gray-50 transition">
//                     <td className="p-4 font-bold text-navy">
//                       {lead.name || (
//                         <span className="text-gray-400 italic">بدون اسم</span>
//                       )}
//                     </td>
//                     <td className="p-4 text-gray-600 font-mono text-sm">
//                       {lead.email}
//                     </td>
//                     <td className="p-4 text-gray-400 text-sm">
//                       {new Date(lead.created_at).toLocaleDateString("ar-EG")}
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

// export default LeadsStage;
