import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, LogOut, Lock, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useState } from 'react';

export const Navbar = ({ onLogout, onChangePassword, onCreateCv }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-2">
                            <img className="h-8 w-8" src="/logo.png" alt="CV Maker" />
                            <span className="text-xl font-bold text-gray-900 tracking-tight">CV Maker</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <Button
                            onClick={onCreateCv}
                            variant="primary"
                            color="blue"
                            icon={Plus}
                            className="shadow-sm hover:shadow transition-all"
                        >
                            Create New CV
                        </Button>
                        <div className="h-6 w-px bg-gray-300 mx-2"></div>
                        <Button
                            onClick={onChangePassword}
                            variant="ghost"
                            className="text-gray-600 hover:text-gray-900"
                            icon={Lock}
                        >
                            Change Password
                        </Button>
                        <Button
                            onClick={onLogout}
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            icon={LogOut}
                        >
                            Logout
                        </Button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in-up">
                    <div className="pt-2 pb-3 space-y-1 px-4">
                        <Button
                            onClick={() => { onCreateCv(); setIsMenuOpen(false); }}
                            variant="primary"
                            color="blue"
                            icon={Plus}
                            className="w-full justify-center mb-2"
                        >
                            Create New CV
                        </Button>
                        <Button
                            onClick={() => { onChangePassword(); setIsMenuOpen(false); }}
                            variant="ghost"
                            className="w-full justify-start text-gray-600"
                            icon={Lock}
                        >
                            Change Password
                        </Button>
                        <Button
                            onClick={() => { onLogout(); setIsMenuOpen(false); }}
                            variant="ghost"
                            className="w-full justify-start text-red-600 hover:bg-red-50"
                            icon={LogOut}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
};
