import { useState, useEffect } from "react";
import client from "../../../api/client";
import AuthGuardButton from "../../auth/AuthGuardButton";
import { useAuth } from "../../../context/AuthContext";
import { useGuestUsage } from "../../../hooks/useGuestUsage";
import {
  FaSearch,
  FaStar,
  FaExclamationTriangle,
  FaChartLine,
  FaGlobe,
  FaLightbulb,
  FaUsers,
  FaCommentAlt,
  FaRegClock,
  FaMagic,
  FaCheckCircle,
  FaEye,
} from "react-icons/fa";

const AnalysisStage = ({ project, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(project.research_report || null);
  const { user } = useAuth();
  const { remainingTries, MAX_FREE_TRIES } = useGuestUsage();

  useEffect(() => {
    setReport(project.research_report || null);
  }, [project]);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await client.post(`/v1/projects/${project.id}/analyze/`);
      setReport(response.data);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setLoading(false);
    }
  };

  // --- الحالة 1: شاشة البدء (Empty State) ---
  if (project.stage === "IDEA" || !report) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-gray-100">
              <FaSearch className="text-2xl text-blue-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            تحليل السوق والمنافسين
          </h2>

          <p className="text-gray-600 mb-8 text-sm leading-relaxed">
            قم بتحليل سوق{" "}
            <span className="text-blue-600 font-semibold">
              {project.target_sector}
            </span>
            واكتشف الفرص المتاحة أمام مشروعك
            <span className="block text-gray-700 font-medium mt-1">
              "{project.title}"
            </span>
          </p>

          <div className="mb-8">
            <AuthGuardButton
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-md transition-shadow flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري التحليل...
                </>
              ) : (
                <>
                  <FaMagic />
                  ابدأ التحليل الآن
                </>
              )}
            </AuthGuardButton>
          </div>

          <div className="space-y-4 text-sm text-gray-500">
            <div className="flex items-center justify-center gap-2">
              <FaRegClock className="text-gray-400" />
              <span>يستغرق التحليل 5-10 ثوانٍ</span>
            </div>
            {!user && (
              <div className="flex items-center justify-center gap-2">
                <FaEye className="text-gray-400" />
                <span>متبقي {remainingTries} تحليل مجاني</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- الحالة 2: لوحة النتائج ---
  return (
    <div className="space-y-6">
      {/* شريط الزوار */}
      {!user && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg border border-blue-200 flex items-center justify-center">
                <span className="text-blue-600 font-bold">
                  {remainingTries}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">
                  تحليلات متبقية
                </h4>
                <p className="text-gray-600 text-xs">
                  {remainingTries} من أصل {MAX_FREE_TRIES} عملية تحليل
                </p>
              </div>
            </div>
            <div className="w-24">
              <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{
                    width: `${(remainingTries / MAX_FREE_TRIES) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* العنوان الرئيسي */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-gray-800">نتائج التحليل</h1>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {project.target_sector}
          </span>
        </div>
        <p className="text-gray-600 text-sm">
          تحليل شامل للسوق بناءً على مشروعك "{project.title}"
        </p>
      </div>

      {/* الشبكة الرئيسية */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* القسم الرئيسي - المنافسين */}
        <div className="lg:col-span-2 space-y-6">
          {/* عنوان قسم المنافسين */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <FaUsers className="text-blue-600 text-sm" />
              </div>
              <h2 className="font-semibold text-gray-800">المنافسين</h2>
            </div>
            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
              {(report.data || report.competitors_data || []).length} نتيجة
            </span>
          </div>

          {/* قائمة المنافسين */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(report.data || report.competitors_data || []).map((comp, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-medium text-gray-600">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">
                        {comp.name}
                      </h3>
                      <p className="text-gray-600 text-xs line-clamp-2 mt-1">
                        {comp.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex text-yellow-400 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < Math.round(comp.rating || 0)
                              ? "fill-current"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    {comp.rating && (
                      <span className="text-xs text-gray-500 mt-1">
                        {comp.rating}/5
                      </span>
                    )}
                  </div>
                </div>

                {/* التعليقات */}
                {comp.raw_reviews?.[0] && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCommentAlt className="text-gray-400 text-xs" />
                      <span className="text-xs text-gray-500 font-medium">
                        ملاحظة من عميل
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs italic bg-gray-50 p-2 rounded">
                      "{comp.raw_reviews[0]}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* الشريط الجانبي */}
        <div className="space-y-6">
          {/* المشاكل والفرص */}
          <div className="bg-white border border-red-50 rounded-lg overflow-hidden">
            <div className="bg-red-50 px-4 py-3 border-b border-red-100">
              <div className="flex items-center gap-2">
                <FaExclamationTriangle className="text-red-500" />
                <h3 className="font-semibold text-gray-800 text-sm">
                  المشاكل المكتشفة
                </h3>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {(
                  report.summary_problems ||
                  report.detected_problems ||
                  []
                ).map((problem, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 p-3 bg-red-50/50 rounded border border-red-100"
                  >
                    <div className="flex-shrink-0 w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-gray-700 text-xs">{problem}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ملخص التحليل */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <FaChartLine className="text-blue-300" />
              </div>
              <div>
                <h3 className="font-semibold">ملخص التحليل</h3>
                <p className="text-gray-300 text-xs">نظرة سريعة على النتائج</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                <span className="text-gray-300 text-xs">عدد المنافسين</span>
                <span className="font-semibold text-sm">
                  {(report.data || report.competitors_data || []).length}
                </span>
              </div>

              <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                <span className="text-gray-300 text-xs">المشاكل المكتشفة</span>
                <span className="font-semibold text-sm">
                  {
                    (report.summary_problems || report.detected_problems || [])
                      .length
                  }
                </span>
              </div>

              <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                <span className="text-gray-300 text-xs">قطاع السوق</span>
                <span className="font-semibold text-sm">
                  {project.target_sector}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-400" />
                <span className="text-xs text-gray-300">
                  تم إكمال التحليل بنجاح
                </span>
              </div>
            </div>
          </div>

          {/* إجراءات سريعة */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 text-sm mb-3">
              الخطوة التالية
            </h4>
            <div className="space-y-2">
              <button className="w-full text-center bg-blue-50 text-blue-700 text-xs font-medium py-2 rounded hover:bg-blue-100 transition-colors">
                تصدير التقرير
              </button>
              <button className="w-full text-center bg-gray-50 text-gray-700 text-xs font-medium py-2 rounded hover:bg-gray-100 transition-colors">
                مشاركة النتائج
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ملاحظات ختامية */}
      <div className="pt-6 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <FaLightbulb className="text-blue-500" />
          <div>
            <p className="text-gray-700 text-sm">
              بناءً على تحليل السوق، نوصي بالتركيز على معالجة المشاكل المكتشفة
              أعلاه للتميز في السوق.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              تم إنشاء هذا التحليل بواسطة الذكاء الاصطناعي •{" "}
              {new Date().toLocaleDateString("ar-SA")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisStage;
