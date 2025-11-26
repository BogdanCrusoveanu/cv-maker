import React from 'react';
import { FileText, Layout, Zap, Shield, CheckCircle } from 'lucide-react';

export const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen flex w-full bg-gray-50">
            {/* Left Side - Presentation */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-900 text-white p-12 flex-col justify-between relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <img src="/logo.png" alt="CV Maker Logo" className="w-8 h-8 object-contain" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">CV Maker</h1>
                    </div>

                    <div className="space-y-8 max-w-lg">
                        <h2 className="text-4xl font-bold leading-tight">
                            Build your professional future with confidence.
                        </h2>
                        <p className="text-lg text-blue-100">
                            Create stunning, ATS-friendly CVs in minutes with our professional templates and intuitive builder.
                        </p>

                        <div className="space-y-4 mt-8">
                            <FeatureRow icon={Layout} text="Professional Templates" delay="0" />
                            <FeatureRow icon={Zap} text="Instant PDF Export" delay="100" />
                            <FeatureRow icon={Shield} text="Secure & Private" delay="200" />
                            <FeatureRow icon={CheckCircle} text="ATS Optimized" delay="300" />
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-sm text-blue-200">
                    © {new Date().getFullYear()} CV Maker. All rights reserved.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8 animate-fade-in-up">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                        {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

const FeatureRow = ({ icon: Icon, text, delay }) => (
    <div
        className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-300 transform translate-x-0"
        style={{ animation: `slideIn 0.5s ease-out forwards ${delay}ms`, opacity: 0 }}
    >
        <div className="bg-white/20 p-2 rounded-lg">
            <Icon size={20} className="text-blue-100" />
        </div>
        <span className="font-medium">{text}</span>
    </div>
);
