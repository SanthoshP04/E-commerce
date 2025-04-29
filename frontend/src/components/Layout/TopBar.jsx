import React from 'react';
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io5";
import { RiTwitterXLine } from "react-icons/ri";

const TopBar = () => {
    return (
        <div className="bg-gray-900 text-white p-2 w-full">
            {/* Main container: Adjusts for mobile & desktop */}
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center py-3 px-4">

                {/* Social Icons - Hidden on mobile, shown on medium+ screens */}
                <div className="hidden md:flex items-center space-x-4">
                    <a href="#" className="hover:text-blue-300 transition">
                        <TbBrandMeta size={20} />
                    </a>
                    <a href="#" className="hover:text-blue-300 transition">
                        <IoLogoInstagram size={20} />
                    </a>
                    <a href="#" className="hover:text-blue-300 transition">
                        <RiTwitterXLine size={20} />
                    </a>
                </div>

                {/* Shipping Message - Centered on all screen sizes */}
                <div className="text-sm text-center md:w-auto">
                    <span>WE SHIP WORLDWIDE</span>
                </div>

                {/* Contact Number - Centered on mobile, right-aligned on desktop */}
                <div className="text-sm text-center md:text-right">
                    <a href="tel:+1234567890" className="hover:text-gray-300 transition">
                        +1 (234) 567-789
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TopBar;