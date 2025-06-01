import { type ReactNode } from "react";

interface SidebarProps {
    children: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
    return (
        <aside className="fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-lg">
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="flex items-center justify-center h-16 px-4 border-b">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/4/45/F1_logo.svg"
                        className="h-10"
                        alt="F1 Logo"
                    />
                </div>
                
                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-4 py-4">
                    <ul className="space-y-1">
                        {children}
                    </ul>
                </nav>
                
                {/* Footer */}
                <div className="p-4 border-t text-xs text-gray-500">
                    © {new Date().getFullYear()} F1 Dashboard
                </div>
            </div>
        </aside>
    );
}