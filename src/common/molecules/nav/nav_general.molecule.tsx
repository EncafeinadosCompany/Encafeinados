import { Link, Outlet, useLocation } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "@/common/ui/icons";
import { Button } from "@/common/ui/button";
import { NavItemType } from "@/api/types/nav/nav.types";
import { clearAuthStorage } from "@/common/utils/auth_storage.utils";
import { LogOutIcon, Coffee, ChevronDown, ChevronUp } from "lucide-react";
import logoImage from "@/assets/images/logonav.jpg";
import { ROLES } from "@/common/utils/lists/roles.utils";
import { useState } from "react";


interface NavGeneralProps {
  isMobile: boolean;
  isExpanded: boolean;
  navItems: NavItemType[];
  setIsExpanded: (isExpanded: boolean) => void;
  logoPath?: string;
  coffeecoins?: number;
  isLoading?: boolean;
  role?: string | null;
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
  role,
  logoPath = logoImage,
}: NavGeneralProps) => {
  const location = useLocation();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

  const isRouteActive = (href: string) => {
    if (href === '/coffeelover' && location.pathname === '/coffeelover') {
      return true;
    }

    if (location.pathname.startsWith(href + '/') || location.pathname === href) {
      const moreSpecificMatch = navItems.some(item =>
        item.href !== href &&
        location.pathname.startsWith(item.href) &&
        item.href.startsWith(href) &&
        item.href.length > href.length
      );

      return !moreSpecificMatch;
    }

    return false;
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
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
                  isRouteActive(item.href)
                    ? "bg-gradient-to-r from-amber-50 to-amber-100/70 text-amber-800 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  isExpanded ? "" : "justify-center"
                )}
              >
                <div
                  className={cn(
                    "flex-shrink-0",
                    isRouteActive(item.href)
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
                {isRouteActive(item.href) && !isExpanded && (
                  <div className="absolute left-0 w-1 h-6 bg-amber-500 rounded-r-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Logout button - With enhanced design */}
          <div className="mt-auto border-t border-gray-100">
            <div className="px-2 py-3">
              {role === ROLES.COFFEE_LOVER && (
                <Link
                  to="/coffeelover"
                  className={cn(
                    "flex items-center gap-1  py-2.5 rounded-lg transition-all duration-300",
                    "text-gray-600 hover:bg-amber-100/50 hover:text-amber-800",
                    isExpanded ? "" : "justify-center"
                  )}
                >
                  <img className=" w-8" src="/coins.png" />
                  <span
                    className={cn(
                      "font-medium whitespace-nowrap transition-opacity duration-300",
                      isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                    )}
                  >
                    <p className="text-sm">{ coffeecoins }</p>
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

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className={`flex-1 w-full relative ${isMobile ? '' : ''}`}>
          <Outlet />
        </main>

        {isMobile && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white z-[100]">
            {isMenuExpanded && navItems.length > 4 && (
              <div className="absolute bottom-full w-full bg-white shadow-[0_-4px_30px_-1px_rgba(0,0,0,0.08)] rounded-t-2xl border-t border-gray-100 transition-all duration-300">
                <nav className="grid grid-cols-4 gap-2 p-4">
                  {navItems.slice(4).map((item) => (
                    
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 relative",
                          isRouteActive(item.href)
                            ? "text-amber-800 bg-amber-50"
                            : "text-gray-500 hover:text-amber-600 hover:bg-amber-50/30"
                        )}
                        onClick={() => setIsMenuExpanded(false)}
                      >
                        <div className={cn(
                          "p-1 rounded-lg",
                          isRouteActive(item.href) ? "bg-amber-100" : ""
                        )}>
                          {item.icon}
                        </div>
                        <span className="text-[10px] font-medium mt-0.5 truncate max-w-[60px] text-center">
                          {item.title}
                        </span>
                      </Link>

                  ))}
                   <Link
                  to="/"
                  className="flex flex-col items-center justify-center px-2 py-1.5 rounded-xl transition-all duration-300 text-gray-500 hover:text-red-600 hover:bg-red-50/30"
                  onClick={clearAuthStorage}
                >
                  <div className="p-1">
                    <LogOutIcon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-medium mt-0.5">Salir</span>
                </Link>

                </nav>
              </div>
            )}

            {/* Main bottom navigation */}
            <nav className="flex justify-around items-center h-16 px-2 bg-white shadow-[0_-4px_30px_-1px_rgba(0,0,0,0.08)] border-t border-gray-100">
              {/* CoffeeCoins Link */}
              {role === ROLES.COFFEE_LOVER && (
                <Link
                  to="/coffeelover"
                  className="flex flex-col items-center justify-center px-2 py-1 rounded-xl transition-all duration-300 text-gray-500 hover:text-amber-600 hover:bg-amber-50/30"
                >
                  <div className="relative">
                    <img className="h-8 w-8" src="/coins.png" alt="Coffee Coins" />
                    <span className="absolute -top-1 -right-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] flex items-center justify-center">
                      {coffeecoins || 0}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium mt-0.5">Coins</span>
                </Link>
              )}



              {/* First 4 navigation items */}
              {navItems.slice(0, 4).map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center px-2 py-1.5 rounded-xl transition-all duration-300 relative",
                    isRouteActive(item.href)
                      ? "text-amber-800 bg-amber-50"
                      : "text-gray-500 hover:text-amber-600 hover:bg-amber-50/30"
                  )}
                >
                  <div className={cn(
                    "p-1 rounded-lg",
                    isRouteActive(item.href) ? "bg-amber-100" : ""
                  )}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-medium mt-0.5 truncate max-w-[60px] text-center">
                    {item.title}
                  </span>
                </Link>
              ))}

              {/* More button when there are more than 5 items */}
              {navItems.length > 5 ? (
                <button
                  onClick={() => setIsMenuExpanded(!isMenuExpanded)}
                  className={cn(
                    "flex flex-col items-center justify-center px-2 py-1.5 rounded-xl transition-all duration-300",
                    isMenuExpanded ? "text-amber-800 bg-amber-50" : "text-gray-500 hover:text-amber-600 hover:bg-amber-50/30"
                  )}
                >
                  <div className="p-1 rounded-lg">
                    {isMenuExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronUp className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-[10px] font-medium mt-0.5">Más</span>
                </button>
              ) : (
                <Link
                  to="/"
                  className="flex flex-col items-center justify-center px-2 py-1.5 rounded-xl transition-all duration-300 text-gray-500 hover:text-red-600 hover:bg-red-50/30"
                  onClick={clearAuthStorage}
                >
                  <div className="p-1">
                    <LogOutIcon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-medium mt-0.5">Salir</span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};
