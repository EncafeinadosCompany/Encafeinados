import { Link, Outlet, useLocation } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "@/common/ui/icons";
import { Button } from "@/common/ui/button";
import { NavItemType } from "@/common/types/navTypes";
import { clearAuthStorage } from "@/common/utils/authStorage";
import { LogOutIcon, Coffee, CupSoda } from "lucide-react";
import { useState, useEffect } from "react";
import logoImage from "@/assets/images/logonav.jpg";

interface NavGeneralProps {
  isMobile: boolean;
  isExpanded: boolean;
  navItems: NavItemType[];
  setIsExpanded: (isExpanded: boolean) => void;
  logoPath?: string;
  coffeecoins?: number;
  isLoading?: boolean;
}

const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export const NavGeneral = ({
  isMobile,
  isExpanded,
  navItems,
  setIsExpanded,
  coffeecoins,
  isLoading,
  logoPath = logoImage,
}: NavGeneralProps) => {
  const location = useLocation();


  useEffect(() => {
    if (window.innerWidth <= 768 && isExpanded) {
      setIsExpanded(false);
    }
  }, [location.pathname, setIsExpanded]);

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar by desktop */}
      {!isMobile && (
        <div
          className={cn(
            "md:flex flex-col sticky top-0 h-screen bg-white shadow-lg border-r border-gray-100 z-50 transition-all duration-400 overflow-hidden flex-shrink-0",
            isExpanded ? "w-56" : "w-16"
          )}
        >
          <div
            className={cn(
              "transition-all duration-400 relative",
              isExpanded ? "pt-5 pb-4" : "py-4"
            )}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r"></div>
            <div
              className={cn(
                "flex items-center",
                isExpanded ? "px-4 flex-row gap-3" : "justify-center"
              )}
            >
              <div
                className={cn(
                  "flex-shrink-0 relative",
                  isExpanded ? "w-9 h-9" : "w-8 h-8"
                )}
              >
                <div className="absolute inset-0"></div>

                <div className="absolute inset-0 p-0.5">
                  {logoPath ? (
                    <img
                      src={logoPath}
                      alt="Encafeinados"
                      className="h-full w-full object-cover rounded "
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-amber-500 to-amber-700 rounded shadow-sm">
                      <Coffee className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
              {isExpanded && (
                <div className="flex-grow min-w-0 overflow-hidden">
                  <h1 className="font-bold text-gray-800 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                    <span className="md:text-xs lg:text-sm xl:text-base">
                      <span className="text-amber-700">ENCA</span>FEINADOS
                    </span>
                  </h1>
                </div>
              )}

              {isExpanded && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(false)}
                  aria-label="Collapse menu"
                  className="h-7 w-7 hover:bg-amber-50 rounded-lg text-amber-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Expand button */}
            {!isExpanded && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(true)}
                aria-label="Expand menu"
                className="w-full flex justify-center mt-2 text-amber-700 hover:bg-amber-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}

            {/* Separator decoration */}
            <div className="mt-3 mx-3 h-[1px] bg-gradient-to-r from-transparent via-amber-200 to-transparent"></div>
          </div>

          {/* Main navigation - Enhanced */}
          <nav className="flex flex-col gap-1 p-2 mt-1 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 relative",
                  location.pathname.startsWith(item.href)
                    ? "bg-gradient-to-r from-amber-50 to-amber-100/70 text-amber-800 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  isExpanded ? "" : "justify-center"
                )}
              >
                <div
                  className={cn(
                    "flex-shrink-0",
                    location.pathname.startsWith(item.href)
                      ? "text-amber-600"
                      : "text-gray-500"
                  )}
                >
                  {item.icon}
                </div>
                <span
                  className={cn(
                    "font-medium whitespace-nowrap transition-opacity duration-300",
                    isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                  )}
                >
                  {item.title}
                </span>

                {/* Visual indicator for active item */}
                {location.pathname.startsWith(item.href) && !isExpanded && (
                  <div className="absolute left-0 w-1 h-6 bg-amber-500 rounded-r-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Logout button - With enhanced design */}
          <div className="mt-auto border-t border-gray-100">
            <div className="px-2 py-3">
             {coffeecoins && (
               <Link
               to="/coffeelover"
               className={cn(
                 "flex items-center gap-1  py-2.5 rounded-lg transition-all duration-300",
                 "text-gray-600 hover:bg-amber-100/50 hover:text-amber-800",
                 isExpanded ? "" : "justify-center"
               )}
             >
               <img className=" w-9" src="/coffeecoins.png" />
               <span
                  className={cn(
                    "font-medium whitespace-nowrap transition-opacity duration-300",
                    isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                  )}
                >
                <p className="text-sm">{coffeecoins}</p>
                </span>
             </Link>
             )}
              <Link
                to="/"
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300",
                  "text-gray-600 hover:bg-red-50/50 hover:text-red-700",
                  isExpanded ? "" : "justify-center"
                )}
                onClick={clearAuthStorage}
              >
                <div className="flex-shrink-0 text-gray-500">
                  <LogOutIcon className="h-4 w-4" />
                </div>
                <span
                  className={cn(
                    "font-medium whitespace-nowrap transition-opacity duration-300",
                    isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                  )}
                >
                  Salir
                </span>
              </Link>

            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 w-full relative ">
          <Outlet />
        </main>

        {isMobile && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_30px_-1px_rgba(0,0,0,0.08)] z-[100] rounded-t-2xl border-t border-gray-100">
            <nav className="flex justify-around items-center h-16 px-2">
              {coffeecoins && (
                <Link
                  to="/coffeelover"
                  className="flex flex-col items-center justify-center px-2 py-1 rounded-xl transition-all duration-300 text-gray-500 hover:text-red-600 hover:bg-red-50/30"
                >
                  <img className="h-10 w-10 m-1" src="/coffeecoins.png" />

                  <span className="text-[12px] font-medium">{coffeecoins}</span>
                </Link>
              )}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center px-2 py-2 rounded-xl transition-all duration-300 relative",
                    location.pathname.startsWith(item.href)
                      ? "text-amber-800 transform scale-105"
                      : "text-gray-500 hover:text-amber-600 hover:bg-amber-50/30"
                  )}
                >
                  <span className="m-1">{item.icon}</span>
                  <span className="text-[10px] font-medium truncate max-w-[50px] text-center">
                    {item.title}
                  </span>
                  {location.pathname.startsWith(item.href) && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full"></div>
                  )}
                </Link>
              ))}

              <Link
                to="/"
                className="flex flex-col items-center justify-center px-2 py-2 rounded-xl transition-all duration-300 text-gray-500 hover:text-red-600 hover:bg-red-50/30"
                onClick={clearAuthStorage}
              >
                <LogOutIcon className="h-4 w-4 m-1" />
                <span className="text-[10px] font-medium">Salir</span>
              </Link>

            </nav>
          </div>
        )}
      </div>
    </div>
  );
};
