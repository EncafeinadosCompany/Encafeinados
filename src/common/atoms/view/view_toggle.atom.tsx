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
    <div className={`flex border rounded-lg overflow-hidden ${className}`}>
      <Button
        variant={currentView === "card" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("card")}
        className="rounded-none border-0"
        title="Vista de tarjetas"
      >
        <Grid className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">Tarjetas</span>
      </Button>

      <Button
        variant={currentView === "table" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("table")}
        className="rounded-none border-0 border-l"
        title="Vista de tabla"
      >
        <List className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">Tabla</span>
      </Button>
    </div>
  );
};
