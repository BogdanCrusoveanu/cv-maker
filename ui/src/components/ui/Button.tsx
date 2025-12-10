import React from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "danger"
    | "ghost"
    | "text"
    | "toggle"
    | "custom"
    | "outline";
  color?:
    | "blue"
    | "green"
    | "purple"
    | "orange"
    | "pink"
    | "teal"
    | "indigo"
    | "red";
  icon?:
    | LucideIcon
    | React.ComponentType<{ size?: number; className?: string }>;
  iconSize?: number;
  isActive?: boolean;
  as?: React.ElementType;
  htmlFor?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  color = "blue",
  icon: Icon,
  iconSize = 18,
  className = "",
  type = "button",
  isActive = false,
  as,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Map colors to their tailwind classes to ensure they are picked up
  const colorVariants: Record<string, string> = {
    blue: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500",
    green: "bg-green-500 hover:bg-green-600 focus:ring-green-500",
    purple: "bg-purple-500 hover:bg-purple-600 focus:ring-purple-500",
    orange: "bg-orange-500 hover:bg-orange-600 focus:ring-orange-500",
    pink: "bg-pink-500 hover:bg-pink-600 focus:ring-pink-500",
    teal: "bg-teal-500 hover:bg-teal-600 focus:ring-teal-500",
    indigo: "bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500",
    red: "bg-red-500 hover:bg-red-600 focus:ring-red-500",
  };

  const textColors: Record<string, string> = {
    blue: "text-blue-500 hover:text-blue-700",
    green: "text-green-500 hover:text-green-700",
    purple: "text-purple-500 hover:text-purple-700",
    orange: "text-orange-500 hover:text-orange-700",
    pink: "text-pink-500 hover:text-pink-700",
    teal: "text-teal-500 hover:text-teal-700",
    indigo: "text-indigo-600 hover:text-indigo-800",
    red: "text-red-500 hover:text-red-700",
  };

  const variants: Record<string, string> = {
    primary: `${
      colorVariants[color] || colorVariants.blue
    } text-white py-2 px-4 shadow-sm`,
    danger:
      "bg-red-500 hover:bg-red-600 text-white py-2 px-4 shadow-sm focus:ring-red-500",
    ghost:
      "text-gray-400 hover:text-red-500 p-1 bg-transparent hover:bg-transparent focus:ring-0",
    text: `${
      textColors[color] || textColors.blue
    } text-sm bg-transparent hover:bg-transparent focus:ring-0`,
    toggle: isActive
      ? "bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 text-sm"
      : "bg-gray-100 text-gray-500 border border-gray-200 px-3 py-1.5 text-sm",
    custom: "",
    outline:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-200 p-2",
  };

  const variantClasses =
    variant === "toggle"
      ? variants.toggle
      : variants.hasOwnProperty(variant)
      ? variants[variant]
      : variants.primary;

  const Component = as || "button";
  const typeAttribute = Component === "button" ? type : undefined;

  return (
    <Component
      type={typeAttribute}
      onClick={onClick}
      className={`${baseStyles} ${variantClasses} ${className}`}
      {...props}
    >
      {Icon && <Icon size={iconSize} className={children ? "mr-2" : ""} />}
      {children}
    </Component>
  );
};
