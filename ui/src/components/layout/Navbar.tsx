import { Link } from "react-router-dom";
import { Plus, LogOut, Lock, Menu, X, ChevronDown, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Dropdown, DropdownItem } from "../ui/Dropdown";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../LanguageSwitcher";

import { useAuth } from "../../context/AuthContext";

interface NavbarProps {
  onLogout: () => void;
  onChangePassword: () => void;
  onCreateCv: () => void;
  onDeleteAccount: () => void;
}

export const Navbar = ({
  onLogout,
  onChangePassword,
  onCreateCv,
  onDeleteAccount,
}: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const { t } = useTranslation();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="flex-shrink-0 flex items-center gap-2"
            >
              <img className="h-8 w-8" src="/logo.png" alt="CV Maker" />
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                CV Maker
              </span>
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
              {t("app.createNew")}
            </Button>

            <div className="h-6 w-px bg-gray-300 mx-2"></div>

            <div className="mx-2">
              <LanguageSwitcher />
            </div>

            {user?.name && (
              <Dropdown
                trigger={
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors text-gray-900"
                  >
                    <div className="text-right hidden lg:block">
                      <div className="text-sm font-medium">{user.name}</div>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm border-2 border-white ring-1 ring-gray-100">
                      {getInitials(user.name)}
                    </div>
                    <ChevronDown size={16} className="text-gray-500" />
                  </Button>
                }
              >
                <DropdownItem onClick={onChangePassword} icon={Lock}>
                  {t("app.changePassword")}
                </DropdownItem>
                <DropdownItem onClick={onLogout} icon={LogOut}>
                  {t("app.logout")}
                </DropdownItem>
                <div className="h-px bg-gray-100 my-1"></div>
                <DropdownItem
                  onClick={onDeleteAccount}
                  icon={Trash2}
                  variant="danger"
                >
                  {t("app.deleteAccount")}
                </DropdownItem>
              </Dropdown>
            )}
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
              onClick={() => {
                onCreateCv();
                setIsMenuOpen(false);
              }}
              variant="primary"
              color="blue"
              icon={Plus}
              className="w-full justify-center mb-2"
            >
              {t("app.createNew")}
            </Button>
            <Button
              onClick={() => {
                onChangePassword();
                setIsMenuOpen(false);
              }}
              variant="ghost"
              className="w-full justify-start text-gray-600"
              icon={Lock}
            >
              {t("app.changePassword")}
            </Button>
            <Button
              onClick={() => {
                onLogout();
                setIsMenuOpen(false);
              }}
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:bg-gray-50"
              icon={LogOut}
            >
              {t("app.logout")}
            </Button>
            <Button
              onClick={() => {
                onDeleteAccount();
                setIsMenuOpen(false);
              }}
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50"
              icon={Trash2}
            >
              {t("app.deleteAccount")}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
