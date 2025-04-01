import { Link, Outlet, useLocation } from "react-router-dom"
import {ChevronRight, ChevronLeft } from "@/common/ui/icons"
import { Button } from "@/common/ui/button"
import { NavItemType } from "@/common/types/navTypes"

interface NavGeneralProps  {
    isMobile: boolean
    isExpanded: boolean
    navItems: NavItemType[]
    setIsExpanded: (isExpanded: boolean) => void
}

const cn = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ")
  }
  

export const NavGeneral = ({isMobile, isExpanded, navItems, setIsExpanded}:NavGeneralProps) => {
    const location = useLocation();
    return (
       <>
         {/* Mobile Bottom Navigation */}
      {isMobile ? (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-xl border-t border-amber-100 z-[100] rounded-t-xl">
          <nav className="flex justify-around items-center h-16">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center px-2 py-1 rounded-md transition-all duration-300",
                  location.pathname === item.href 
                    ? "text-amber-800 bg-amber-50 transform scale-110 shadow-md" 
                    : "text-muted-foreground hover:text-amber-700 hover:bg-amber-50/50",
                )}
              >
                {item.icon}
                <span className="text-xs mt-1 font-medium">{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      ) : (
        /* Desktop/Tablet Side Navigation */
        <div
          className={cn(
            "hidden md:block fixed left-0 top-0 bottom-0 bg-gradient-to-b from-amber-50 to-white border-r border-amber-100 shadow-lg z-50 transition-all duration-500",
            isExpanded ? "w-56" : "w-16",
          )}
        >
          <div className="flex justify-end p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
              className="hover:bg-amber-100 text-amber-800"
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
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-500",
                  location.pathname === item.href
                    ? "bg-amber-100 text-amber-800 shadow-md font-medium" 
                    : "text-muted-foreground hover:bg-amber-50 hover:text-amber-700",
                  isExpanded ? "" : "justify-center"
                )}
              >
                {item.icon}
                {isExpanded && <span className="font-medium text-gray-600">{item.title}</span>}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Main content area with appropriate padding */}
      <main 
        className={cn(
          "flex-1 w-full transition-all duration-500",
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