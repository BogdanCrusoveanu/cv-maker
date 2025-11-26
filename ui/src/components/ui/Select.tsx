import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { value: string; label: string }[];
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'teal' | 'indigo';
    placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
    label,
    value,
    onChange,
    options,
    color = 'blue',
    className = '',
    placeholder,
    ...props
}) => {
    const focusColors: Record<string, string> = {
        blue: "focus:ring-blue-500",
        green: "focus:ring-green-500",
        purple: "focus:ring-purple-500",
        orange: "focus:ring-orange-500",
        pink: "focus:ring-pink-500",
        teal: "focus:ring-teal-500",
        indigo: "focus:ring-indigo-500",
    };

    const focusClass = focusColors[color] || focusColors.blue;

    return (
        <div className={className}>
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <select
                value={value}
                onChange={onChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusClass} focus:border-transparent outline-none transition-all bg-white`}
                {...props}
            >
                {placeholder && <option value="" disabled>{placeholder}</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
