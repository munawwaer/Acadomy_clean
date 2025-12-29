import { useEffect, useState } from "react";
import client from "../../api/client"; // تأكد من المسار
import {
  FaUsers,
  FaRocket,
  FaDatabase,
  FaChartLine,
  FaEdit,
  FaEnvelope,
  FaTrash,
} from "react-icons/fa";
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

const AdminDashboardHome = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_projects: 0,
    total_leads: 0,
    recent_users: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await client.get("/v1/core/admin/stats/");
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching stats", error);
        // بيانات وهمية للعرض في حالة فشل الاتصال (للتجربة)
        setStats({
          total_users: 1250,
          total_projects: 45,
          total_leads: 3200,
          recent_users: [
            {
              id: 1,
              email: "ahmed@example.com",
              date_joined: new Date().toISOString(),
              is_active: true,
            },
            {
              id: 2,
              email: "sara@company.com",
              date_joined: new Date().toISOString(),
              is_active: false,
            },
            {
              id: 3,
              email: "dev@tech.net",
              date_joined: new Date().toISOString(),
              is_active: true,
            },
            {
              id: 4,
              email: "manager@store.com",
              date_joined: new Date().toISOString(),
              is_active: true,
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="w-10 h-10 border-4 border-navy border-t-gold rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. بطاقات الإحصائيات العلوية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="إجمالي المستخدمين"
          value={stats.total_users}
          icon={<FaUsers />}
          trend="+12% هذا الشهر"
          color="bg-blue-600"
          shadow="shadow-blue-200"
        />
        <StatCard
          title="المشاريع المنشورة"
          value={stats.total_projects}
          icon={<FaRocket />}
          trend="+5 مشاريع جديدة"
          color="bg-purple-600"
          shadow="shadow-purple-200"
        />
        <StatCard
          title="قاعدة البيانات (Leads)"
          value={stats.total_leads}
          icon={<FaDatabase />}
          trend="+85 هذا الأسبوع"
          color="bg-emerald-600"
          shadow="shadow-emerald-200"
        />
      </div>

      {/* 2. قسم الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* الرسم البياني الكبير (المساحة) */}
        <div className="lg:col-span-2">
          <GrowthChart />
        </div>
        {/* الرسم البياني الدائري */}
        <div>
          <ProjectDistributionChart />
        </div>
      </div>

      {/* 3. جدول أحدث المستخدمين */}
      <UsersTable users={stats.recent_users} />
    </div>
  );
};

// --- المكونات الفرعية (Sub-Components) ---

// 1. بطاقة الإحصائيات
const StatCard = ({ title, value, icon, trend, color, shadow }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between hover:-translate-y-1 transition duration-300 group">
    <div>
      <p className="text-gray-500 text-xs font-bold mb-2 uppercase tracking-wide">
        {title}
      </p>
      <h3 className="text-3xl font-black text-navy mb-1 group-hover:text-gold transition-colors">
        {value}
      </h3>
      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md inline-block">
        {trend}
      </span>
    </div>
    <div
      className={`w-14 h-14 ${color} ${shadow} text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
    >
      {icon}
    </div>
  </div>
);

// 2. رسم بياني للنمو (Area Chart)
const GrowthChart = () => {
  const data = [
    { name: "يناير", users: 400 },
    { name: "فبراير", users: 300 },
    { name: "مارس", users: 600 },
    { name: "أبريل", users: 800 },
    { name: "مايو", users: 1500 },
    { name: "يونيو", users: 2000 },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-navy flex items-center gap-2">
          <FaChartLine className="text-gold" /> نمو المستخدمين
        </h3>
        <select className="text-xs border-none bg-gray-50 rounded-lg px-2 py-1 outline-none cursor-pointer">
          <option>آخر 6 أشهر</option>
          <option>آخر سنة</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0a192f" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#0a192f" stopOpacity={0} />
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
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
            cursor={{
              stroke: "#d4af37",
              strokeWidth: 1,
              strokeDasharray: "5 5",
            }}
          />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#0a192f"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorUsers)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// 3. رسم بياني للتوزيع (Pie Chart)
const ProjectDistributionChart = () => {
  const data = [
    { name: "تقنية", value: 400 },
    { name: "عقارات", value: 300 },
    { name: "مطاعم", value: 300 },
    { name: "أخرى", value: 200 },
  ];
  const COLORS = ["#0a192f", "#d4af37", "#10b981", "#6b7280"];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96 flex flex-col">
      <h3 className="font-bold text-navy mb-2">توزيع القطاعات</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "none" }}
              itemStyle={{ color: "#0a192f", fontWeight: "bold" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 mt-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-sm"
              style={{ backgroundColor: COLORS[index] }}
            ></span>
            <span className="font-medium">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. جدول المستخدمين
const UsersTable = ({ users }) => {
  if (!users || users.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
        <h3 className="font-bold text-navy text-base">أحدث المسجلين بالنظام</h3>
        <button className="text-xs text-gold font-bold hover:underline">
          إدارة المستخدمين
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right min-w-[600px]">
          <thead className="text-gray-400 font-normal border-b border-gray-50">
            <tr>
              <th className="px-6 py-4 font-normal">المستخدم</th>
              <th className="px-6 py-4 font-normal">تاريخ التسجيل</th>
              <th className="px-6 py-4 font-normal">الحالة</th>
              <th className="px-6 py-4 font-normal text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-blue-50/10 transition group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-navy/5 flex items-center justify-center text-navy font-bold text-xs border border-navy/10">
                      {user.email?.substring(0, 2).toUpperCase() || "??"}
                    </div>
                    <div>
                      <p className="font-bold text-navy text-sm">
                        {user.email}
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono">
                        ID: #{user.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 font-medium">
                  {new Date(user.date_joined).toLocaleDateString("en-GB")}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                      user.is_active
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-red-50 text-red-600 border-red-100"
                    }`}
                  >
                    {user.is_active ? "نشط" : "محظور"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition"
                      title="تعديل"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition"
                      title="مراسلة"
                    >
                      <FaEnvelope size={14} />
                    </button>
                    <button
                      className="p-1.5 text-red-400 hover:bg-red-50 rounded transition"
                      title="حذف"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
