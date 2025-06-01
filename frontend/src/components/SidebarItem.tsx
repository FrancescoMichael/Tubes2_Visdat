import { type ReactNode } from "react";

interface SidebarItemProps {
    text: string;
    active?: boolean;
    alert?: boolean;
    onClick?: () => void;
    icon?: ReactNode;
}

export function SidebarItem({ text, active, alert, onClick, icon }: SidebarItemProps) {
    return (
        <li>
            <button
                onClick={onClick}
                className={`
                    w-full flex items-center px-4 py-3 rounded-lg
                    transition-colors duration-200
                    ${active
                        ? "bg-red-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                    }
                    focus:outline-none focus:ring-2 focus:ring-red-500
                `}
            >
                {icon && <span className="mr-3">{icon}</span>}
                <span className="font-medium" style={{ fontFamily: active ? "Formula1Bold" : "Formula1" }}>
                    {text}
                </span>
                {alert && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        New
                    </span>
                )}
            </button>
        </li>
    );
}