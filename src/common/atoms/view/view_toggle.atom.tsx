import { Grid, List } from "lucide-react";
import { Button } from "@/common/ui/button";

export type ViewMode = "card" | "table";

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  className?: string;
}

export const ViewToggle = ({
  currentView,
  onViewChange,
  className = "",
}: ViewToggleProps) => {
  return (
    <div className={`relative flex bg-[#F5E4D2]/30 p-1 rounded-xl border border-[#E6D7C3]/40 backdrop-blur-sm ${className}`}>
      {/* Background slider */}
      <div 
        className={`
          absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm
          transition-all duration-300 ease-out border border-[#E6D7C3]/30
          ${currentView === "card" ? 'left-1' : 'left-[calc(50%+4px-1px)]'}
        `}
      />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("card")}
        className={`
          relative z-10 flex-1 h-9 px-3 rounded-lg border-0 font-medium
          transition-all duration-200 hover:bg-transparent
          ${currentView === "card" 
            ? 'text-[#8B5A2B] shadow-none' 
            : 'text-gray-500 hover:text-[#8B5A2B]'
          }
        `}
        title="Vista de tarjetas"
      >
        <Grid className="h-4 w-4" />
        <span className="ml-2 text-xs font-medium hidden sm:inline">Tarjetas</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("table")}
        className={`
          relative z-10 flex-1 h-9 px-3 rounded-lg border-0 font-medium
          transition-all duration-200 hover:bg-transparent
          ${currentView === "table" 
            ? 'text-[#8B5A2B] shadow-none' 
            : 'text-gray-500 hover:text-[#8B5A2B]'
          }
        `}
        title="Vista de tabla"
      >
        <List className="h-4 w-4" />
        <span className="ml-2 text-xs font-medium hidden sm:inline">Tabla</span>
      </Button>
    </div>
  );
};
