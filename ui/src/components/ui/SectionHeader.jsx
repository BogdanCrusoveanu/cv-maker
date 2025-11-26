import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from './Button';

export const SectionHeader = ({ title, color, onAdd, addButtonLabel }) => {
    const borderColors = {
        blue: "border-blue-500",
        green: "border-green-500",
        purple: "border-purple-500",
        orange: "border-orange-500",
        pink: "border-pink-500",
        teal: "border-teal-500",
        indigo: "border-indigo-500",
    };

    const borderClass = borderColors[color] || borderColors.blue;

    return (
        <div className="flex justify-between items-center mb-4">
            <h2 className={`text-2xl font-bold text-gray-800 pb-2 border-b-2 ${borderClass}`}>
                {title}
            </h2>
            <Button onClick={onAdd} color={color} icon={Plus}>
                {addButtonLabel}
            </Button>
        </div>
    );
};
