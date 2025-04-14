import { Link, Outlet, useLocation } from "react-router-dom"
import { ChevronRight, ChevronLeft } from "@/common/ui/icons"
import { Button } from "@/common/ui/button"
import { NavItemType } from "@/common/types/navTypes"
import { clearAuthStorage } from "@/common/utils/authStorage"
import { LogOutIcon } from "lucide-react"

interface NavGeneralProps {
  isMobile: boolean
  isExpanded: boolean
  navItems: NavItemType[]
  setIsExpanded: (isExpanded: boolean) => void
}

const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ")
}


export const NavGeneral = ({ isMobile, isExpanded, navItems, setIsExpanded }: NavGeneralProps) => {
  const location = useLocation();
  return (
    <>
      {/* Mobile Bottom Navigation */}
      {isMobile ? (
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_70px_-1px_rgba(0,0,0,0.1)] z-[100] rounded-t-xl">
          <nav className="flex justify-around items-center h-16">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center px-2 py-1 rounded-md transition-all duration-300 relative",
                  location.pathname === item.href
                    ? "text-gray-300 bg-white transform scale-110 "
                    : "text-muted-foreground hover:text-amber-700 hover:bg-amber-50/50",
                )}
              >
               <span className="m-2"> {item.icon}</span>
                {/* <span className="text-xs mt-1 font-medium">{item.title}</span> */}
                {location.pathname === item.href && (
                  <div className="absolute  bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#f7952c] rounded-full"></div>
                )}
              </Link>
            ))}
            <Link
              to={"/"}
              className={cn(
                "flex flex-col items-center justify-center px-2 py-1 rounded-md transition-all duration-300 relative",
                location.pathname === "/"
                  ? "text-amber-800 bg-amber-50 transform scale-110 shadow-md"
                  : "text-muted-foreground hover:text-amber-700 hover:bg-amber-50/50",
              )}
              onClick={clearAuthStorage}
            >
              {location.pathname === "/" && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
              )}
              <div className="flex-shrink-0 text-gray-300"><LogOutIcon className="h-4 w-4" /></div>
            </Link>
          </nav>
        </div>
      ) : (
        /* Desktop/Tablet Side Navigation */
            <div
          className={cn(
            "hidden md:block fixed left-0 top-0 bottom-0 bg-white shadow-lg z-50 transition-all duration-500 overflow-hidden",
            isExpanded ? "w-56" : "w-16",
          )}
        >
          <div className={isExpanded? "flex justify-end p-2":"flex justify-center p-2"}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
              className="hover:bg-gray-200/50 hover:rounded-full text-amber-800"
            >
              {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>

          <nav className="flex flex-col gap-2 p-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center  gap-3 px-3 py-2 rounded-md transition-all duration-500",
                  location.pathname === item.href
                    ? "bg-[#F5E4D2]  text-amber-800 shadow-md font-medium"
                    : "text-muted-foreground hover:bg-amber-50 hover:text-amber-700",
                  isExpanded ? "" : "justify-center"
                )}
              >
                <div className="flex-shrink-0 text-gray-500">{item.icon}</div>
                <span 
                  className={cn(
                    "font-medium text-gray-600 whitespace-nowrap transition-opacity duration-300",
                    isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                  )}
                >
                  {item.title}
                </span>
              </Link>
            ))}
             <Link
              to={"/"}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-500",
                location.pathname === "/"
                  ? "bg-[#F5E4D2] text-amber-800 shadow-md font-medium"
                  : "text-muted-foreground hover:bg-amber-50  hover:text-amber-700",
                isExpanded ? "" : "justify-center"
              )}
              onClick={clearAuthStorage}
            >
              <div className="flex-shrink-0 text-gray-500"><LogOutIcon className="h-4 w-4" /></div>
              <span 
                className={cn(
                  "font-medium text-gray-600 whitespace-nowrap transition-opacity duration-300",
                  isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                )}
              >
                Cerrar sesión
              </span>
            </Link>
          </nav>
        </div>

      )}

      {/* Main content area with appropriate padding */}
      <main
        className={cn(
          "flex-1 w-full transition-all duration",
          isMobile
            ? "pb-24" // Increased bottom padding for mobile to account for bottom nav
            : isExpanded
              ? "md:ml-56" // Margin when sidebar is expanded
              : "md:ml-16", // Margin when sidebar is collapsed
        )}
      >
        <div className="h-full w-full">
          <Outlet />
        </div>
      </main>
    </>
  )
}