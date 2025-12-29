import { useState, useEffect } from "react";

const MAX_FREE_TRIES = 3; // 👈 هنا تحدد عدد المرات المسموحة (3 مثلاً)

export const useGuestUsage = () => {
  var [usageCount, setUsageCount] = useState(0);

  // عند تحميل الصفحة، اقرأ العداد من ذاكرة المتصفح
  useEffect(() => {
    const savedCount = localStorage.getItem("guest_tool_usage");
    if (savedCount) {
      setUsageCount(parseInt(savedCount, 10));
    }
  }, []);

  // دالة لزيادة العداد عند استخدام أداة
  const incrementUsage = () => {
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem("guest_tool_usage", newCount.toString());
  };

  // هل ما زال لديه رصيد؟
  const hasRemainingTries = usageCount < MAX_FREE_TRIES;

  // كم باقي له؟
  const remainingTries = Math.max(0, MAX_FREE_TRIES - usageCount);

  return {
    usageCount,
    hasRemainingTries,
    remainingTries,
    incrementUsage,
    MAX_FREE_TRIES,
  };
};
