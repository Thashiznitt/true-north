import React from "react";

interface PhoneMockupProps {
    children: React.ReactNode;
}

export function PhoneMockup({ children }: PhoneMockupProps) {
    return (
        <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl overflow-hidden group">
            <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
            <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
            <div className="rounded-[2rem] overflow-hidden w-full h-full bg-background relative">
                {/* Notch */}
                <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 z-20 flex items-center justify-center">
                    <div className="w-16 h-4 bg-black rounded-full mb-1"></div>
                </div>
                {children}
            </div>
        </div>
    );
}
