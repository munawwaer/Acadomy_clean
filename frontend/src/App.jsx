import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useOutletContext,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// --- Layouts ---
import DashboardLayout from "./components/layout/DashboardLayout"; // قالب المستخدم
import AdminDashboard from "./pages/admin/AdminDashboard"; // قالب الأدمن
// --- Pages: Auth ---
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// --- Pages: Public ---
import LandingPageViewer from "./pages/public/LandingPageViewer";
import PublicDashboardHome from "./pages/public/PublicDashboardHome";
// --- Pages: User Dashboard ---
import DashboardHome from "./pages/dashboard/DashboardHome";
import ProjectsList from "./pages/dashboard/ProjectsList";
import NewProject from "./pages/dashboard/NewProject";
import Profile from "./pages/dashboard/Profile";
import Pricing from "./pages/dashboard/Pricing";

// --- Pages: Project Workspace (User) ---
import ProjectWorkspace from "./pages/workspace/ProjectWorkspace";
import AnalysisStage from "./pages/workspace/stages/AnalysisStage";
import StrategyStage from "./pages/workspace/stages/StrategyStage";
import BuilderStage from "./pages/workspace/stages/BuilderStage";
import LeadsStage from "./pages/workspace/stages/LeadsStage";

// --- Pages: Admin ---
import AdminDashboardHome from "./pages/admin/AdminDashboardHome"; // تأكد من إنشاء هذا الملف أو استخدام DashboardHome
import AdminNotifications from "./pages/admin/AdminNotifications";

// 1. مكون حماية المسارات (للمستخدمين المسجلين)
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gold">
        جاري التحميل...
      </div>
    );
  return user ? children : <Navigate to="/login" />;
};

// 2. مكون تخطيط الصفحات العامة (اختياري)
const PublicLayout = () => (
  <div className="font-sans">
    {/* <DashboardLayout /> يمكن إضافة نافبار الزوار هنا */}
    <Outlet />
    {/* <Footer /> يمكن إضافة فوتر الزوار هنا */}
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* =========================================
              1. المنطقة العامة (Public Zone)
             ========================================= */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<PublicDashboardHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/p/:slug" element={<LandingPageViewer />} />
            <Route path="/new-project" element={<NewProject />} />
            <Route path="/projects" element={<ProjectsList />} />
            {/* مساحة عمل المشروع (داخلها تبويبات) */}

            <Route path="/project/:id" element={<ProjectWorkspace />}>
              <Route index element={<AnalysisConsumer />} />
              <Route path="strategy" element={<StrategyConsumer />} />
              <Route path="builder" element={<BuilderConsumer />} />
              <Route path="leads" element={<LeadsConsumer />} />
            </Route>
          </Route>

          {/* =========================================
              2. منطقة الأدمن (Admin Zone)
              تبدأ بـ /admin
             ========================================= */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<AdminDashboardHome />} />
            <Route path="notifications" element={<AdminNotifications />} />
            {/* <Route path="users" element={<UsersList />} /> */}
          </Route>

          {/* =========================================
              3. منطقة المستخدم (User Workspace)
              محمية بـ PrivateRoute
             ========================================= */}
          <Route
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            {/* توجيه المستخدم لصفحة المشاريع مباشرة عند الدخول */}
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/projects" element={<ProjectsList />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* صفحة 404 */}
          <Route
            path="*"
            element={
              <div className="p-10 text-center">404 - الصفحة غير موجودة</div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// --- Helper Components for Workspace Context ---
// هذه المكونات تستخرج البيانات من Outlet وتمررها للمراحل
const AnalysisConsumer = () => {
  const { project, onUpdate } = useOutletContext();
  return <AnalysisStage project={project} onUpdate={onUpdate} />;
};

const StrategyConsumer = () => {
  const { project, onUpdate } = useOutletContext();
  return <StrategyStage project={project} onUpdate={onUpdate} />;
};

const BuilderConsumer = () => {
  const { project } = useOutletContext();
  return <BuilderStage project={project} />;
};

const LeadsConsumer = () => {
  const { project } = useOutletContext();
  return <LeadsStage project={project} />;
};

export default App;
