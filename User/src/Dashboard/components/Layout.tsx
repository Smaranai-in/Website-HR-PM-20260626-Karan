import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./sidebar/Sidebar";
import Navbar from "./navbar/Navbar";

export default function Layout() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* Sidebar */}
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-x-hidden">

                {/* Navbar */}
                <Navbar setIsOpen={setIsOpen} />

                {/* Page Content */}
                <main className="p-4 sm:p-6 md:p-8 overflow-x-auto">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}