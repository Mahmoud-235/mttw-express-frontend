import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Delete",
  loading,
}) {
  if (!open) return null;

  // المكون بالكامل معزول وهيترمي مباشرة في الـ body عشان يظهر في نص الشاشة المرئية بالظبط
  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(10, 20, 8, 0.65)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center", // توسيط عمودي في الشاشة المرئية
        justifyContent: "center", // توسيط أفقي في الشاشة المرئية
        padding: "16px",
        zIndex: 9999999, // أعلى من أي شيء آخر في الموقع
      }}
      onClick={onClose} // يغلق عند الضغط على الخلفية الفارغة
    >
      {/* الكارد الأبيض الصغير الخاص بالتأكيد */}
      <div
        style={{
          position: "relative",
          backgroundColor: "#ffffff",
          width: "100%",
          maxWidth: "400px",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 24px 64px rgba(20, 29, 16, 0.2)",
          border: "1px solid #dde5d8",
          // نضمن عدم تأثره بأي سكرول خارجي
          maxHeight: "calc(100vh - 32px)",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()} // يمنع الإغلاق عند الضغط داخل الكارد
      >
        {/* الهيدر */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
            gap: "8px",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: 700,
              color: "#141d10",
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "8px",
              color: "#7a9170",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* الرسالة والأيقونة */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#fef0f0",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={18} color="#8b1a1a" />
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "#4a5e42",
              lineHeight: "1.5",
              paddingTop: "2px",
            }}
          >
            {message}
          </p>
        </div>

        {/* الأزرار */}
        <div
          style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}
        >
          <button
            className="ds-btn ds-btn-ghost"
            onClick={onClose}
            disabled={loading}
            style={{ padding: "8px 16px", fontSize: "12.5px" }}
          >
            Cancel
          </button>
          <button
            className="ds-btn ds-btn-primary"
            onClick={onConfirm}
            disabled={loading}
            style={{
              backgroundColor: "#8b1a1a",
              boxShadow: "0 4px 14px rgba(139, 26, 26, 0.3)",
              padding: "8px 16px",
              fontSize: "12.5px",
            }}
          >
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body, // 🚀 السحر هنا: بيطير المودال للـ body مباشرة
  );
}
