import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string; // Additional classes for the content wrapper
  showCloseButton?: boolean;
}

export const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  size = "md",
  className = "",
  showCloseButton = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 300); // Wait for transition
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup Content */}
      <div
        className={`bg-white rounded-xl shadow-2xl w-full mx-4 relative transform transition-all duration-300 ${
          sizeClasses[size]
        } ${className} ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {(title || showCloseButton) && (
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            {title && (
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        <div className="p-6">{children}</div>

        {actions && (
          <div className="flex justify-end gap-3 p-6 pt-0">{actions}</div>
        )}
      </div>
    </div>
  );
};
