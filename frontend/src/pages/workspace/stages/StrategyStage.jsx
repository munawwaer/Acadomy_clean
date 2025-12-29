import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../../api/client";
import Button from "../../../components/ui/Button";
import {
  FaBrain,
  FaMagic,
  FaCheckCircle,
  FaArrowLeft,
  FaLightbulb,
  FaEdit,
  FaRocket,
  FaSync,
} from "react-icons/fa";

const StrategyStage = ({ project, onUpdate }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState(project.strategy || null);

  useEffect(() => {
    if (project.strategy) setStrategy(project.strategy);
  }, [project]);

  const handleGenerateProposal = async () => {
    setLoading(true);
    try {
      const response = await client.post(
        "/v1/intelligence/strategies/generate_proposal/",
        {
          project: project.id,
        }
      );
      setStrategy(response.data);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAndBuild = async () => {
    setLoading(true);
    try {
      await client.post(
        `/v1/intelligence/strategies/${strategy.strategy_id}/build_landing_page/`,
        {
          approved_solutions: strategy.suggestions,
        }
      );
      if (onUpdate) await onUpdate();
      setTimeout(() => {
        navigate(`/dashboard/project/${project.id}/builder`);
      }, 500);
    } catch (error) {
      console.error("Build Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- الحالة 1: لم يتم التحليل ---
  if (project.stage === "IDEA") {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FaBrain className="text-gray-400 text-xl" />
          </div>
          <p className="text-gray-600 text-sm mb-2">
            يجب إكمال مرحلة التحليل أولاً
          </p>
          <p className="text-gray-400 text-xs">
            انتقل إلى تبويب التحليل للمتابعة
          </p>
        </div>
      </div>
    );
  }

  // --- الحالة 2: جاهز للتوليد ---
  if (!strategy) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl flex items-center justify-center mx-auto mb-6 border border-indigo-100">
            <FaBrain className="text-indigo-600 text-xl" />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-3">
            توليد الاستراتيجية الذكية
          </h2>

          <p className="text-gray-600 text-sm mb-8 leading-relaxed">
            بناءً على تحليل السوق، سيقوم الذكاء الاصطناعي بتحويل المشاكل
            المكتشفة إلى حلول عملية وميزات تنافسية
          </p>

          <div className="mb-6">
            <Button
              onClick={handleGenerateProposal}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-md transition-shadow flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري التفكير...
                </>
              ) : (
                <>
                  <FaMagic />
                  توليد الحلول الذكية
                </>
              )}
            </Button>
          </div>

          <div className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <FaSync className="text-xs" />
            يستغرق التوليد بضع ثوانٍ
          </div>
        </div>
      </div>
    );
  }

  // --- الحالة 3: عرض الاستراتيجية ---
  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
              <FaLightbulb className="text-indigo-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">
                المقترح الاستراتيجي
              </h2>
              <p className="text-gray-500 text-xs">
                حلول مقترحة بناءً على تحليل المنافسين
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button className="text-gray-600 text-sm hover:text-indigo-600 font-medium px-4 py-2 border border-gray-300 rounded-lg hover:border-indigo-300 transition-colors flex items-center justify-center gap-2">
              <FaEdit className="text-sm" />
              تعديل يدوي
            </button>
            <Button
              onClick={handleApproveAndBuild}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg font-semibold hover:shadow-md transition-shadow flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري البناء...
                </>
              ) : (
                <>
                  <FaRocket />
                  اعتماد وبناء الصفحة
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FaCheckCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-blue-800 text-sm font-medium">
              النظام جاهز لتحويل هذه الاستراتيجية إلى موقع كامل
            </p>
            <p className="text-blue-600 text-xs mt-1">
              سيتم بناء صفحة هبوط احترافية بناءً على الحلول المعتمدة
            </p>
          </div>
        </div>
      </div>

      {/* Solutions List */}
      <div className="space-y-4">
        {strategy?.suggestions?.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-indigo-200 transition-colors"
          >
            {/* Card Header with Number */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </div>
                <span className="text-xs text-gray-500">مشكلة وحل مقترح</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Problem Section */}
              <div className="mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <h4 className="text-red-600 font-semibold text-sm">
                    المشكلة المرصودة
                  </h4>
                </div>
                <p className="text-gray-700 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                  "{item.problem}"
                </p>
              </div>

              {/* Solution Section */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <h4 className="text-green-600 font-semibold text-sm">
                    الحل المقترح
                  </h4>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <h3 className="text-gray-800 font-bold text-base mb-1">
                    {item.solution}
                  </h3>
                  <p className="text-gray-500 text-xs">
                    سيتم تحويل هذا الحل إلى ميزة رئيسية في صفحة الهبوط
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="bg-gray-800 text-white rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-3">
            <div className="text-2xl font-bold text-indigo-300 mb-1">
              {strategy?.suggestions?.length || 0}
            </div>
            <div className="text-gray-300 text-xs">حل مقترح</div>
          </div>

          <div className="text-center p-3 border-l border-r border-gray-700">
            <div className="text-2xl font-bold text-green-300 mb-1">100%</div>
            <div className="text-gray-300 text-xs">مطابقة مع التحليل</div>
          </div>

          <div className="text-center p-3">
            <div className="text-2xl font-bold text-yellow-300 mb-1">AI</div>
            <div className="text-gray-300 text-xs">
              تم التوليد بالذكاء الاصطناعي
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 text-sm mb-3">
          الخطوات التالية
        </h4>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full text-xs flex items-center justify-center font-bold">
              1
            </div>
            <span className="text-gray-700">اعتماد الحلول المقترحة</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full text-xs flex items-center justify-center font-bold">
              2
            </div>
            <span className="text-gray-700">
              توليد محتوى صفحة الهبوط تلقائياً
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full text-xs flex items-center justify-center font-bold">
              3
            </div>
            <span className="text-gray-700">
              الانتقال إلى مصمم الصفحة للتخصيص
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyStage;
