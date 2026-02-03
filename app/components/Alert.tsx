import type React from "react";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  type: AlertType;
  message: string;
  title?: string;
  onClose?: () => void;
  dismissible?: boolean;
}

export const Alert: React.FC<AlertProps> = ({
  type,
  message,
  title,
  onClose,
  dismissible = true,
}) => {
  const styles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      title: "text-green-900",
      message: "text-green-800",
      icon: "✓",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      title: "text-red-900",
      message: "text-red-800",
      icon: "✕",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      title: "text-yellow-900",
      message: "text-yellow-800",
      icon: "⚠",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      title: "text-blue-900",
      message: "text-blue-800",
      icon: "ℹ",
    },
  };

  const style = styles[type];

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4`}>
      <div className="flex gap-3">
        <div className="flex-shrink-0 text-lg font-bold">{style.icon}</div>
        <div className="flex-1">
          {title && <p className={`${style.title} font-semibold`}>{title}</p>}
          <p className={style.message}>{message}</p>
        </div>
        {dismissible && onClose && (
          <button
            onClick={onClose}
            className={`${style.message} hover:opacity-75 flex-shrink-0 font-bold`}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
