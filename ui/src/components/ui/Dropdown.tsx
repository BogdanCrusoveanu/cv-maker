import React, { useState, useRef, useEffect } from 'react';

interface DropdownProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    align?: 'left' | 'right';
    className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ 
    trigger, 
    children, 
    align = 'right',
    className = '' 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                {trigger}
            </div>

            {isOpen && (
                <div 
                    className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50 animate-fade-in-up`}
                >
                    <div onClick={() => setIsOpen(false)}>
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ElementType;
    variant?: 'default' | 'danger';
}

export const DropdownItem: React.FC<DropdownItemProps> = ({ 
    children, 
    icon: Icon, 
    variant = 'default',
    className = '',
    ...props 
}) => {
    const baseStyles = "flex w-full items-center px-4 py-2 text-sm transition-colors";
    const variantStyles = variant === 'danger' 
        ? "text-red-600 hover:bg-red-50" 
        : "text-gray-700 hover:bg-gray-100";

    return (
        <button 
            className={`${baseStyles} ${variantStyles} ${className}`}
            {...props}
        >
            {Icon && <Icon size={16} className="mr-2" />}
            {children}
        </button>
    );
};
