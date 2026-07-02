import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";

export default function ProgramManagerLayout() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex h-screen">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

            <div className="flex-1 flex flex-col">
                <Navbar setIsOpen={setIsOpen} />

                <div className="p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}