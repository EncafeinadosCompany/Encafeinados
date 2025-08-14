import { FeaturedStoresWidget } from "@/common/widgets/coffeelover/stores/feature_stores.widget";
import SearchCoffee from "@/common/atoms/common/search.atom";
import { useState, useCallback, useEffect } from "react";
import { QrCode, Filter, MapPin } from "@/common/ui/icons";
import { CoffeeBackground } from "@/common/widgets/coffee_background.widget";
import QRScannerDialog from "@/common/molecules/coffeelover/stores/QR_scanner_dialog.molecule";
import { Button } from "@/common/ui/button";
import { EventList } from "@/common/widgets/coffeelover/events/event_list.widget";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/common/ui/tooltip";
import FilterModal from "@/common/molecules/map/filter_modal.molecule";
import { useBranchSearch } from "@/common/hooks/map/useBranchSearch";
import { useNavigate } from "react-router-dom";

export default function PrincipalCoffeelover() {
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const navigate = useNavigate();

  const {
    searchTerm: apiSearchTerm,
    setSearchTerm: setApiSearchTerm,
    filterOptions: apiFilters,
    updateFilterOptions: updateApiFilters,
    resetFilters: resetApiFilters,
    hasActiveFilters: apiHasActiveFilters,
    branches: apiBranches,
    isLoading: apiIsLoading,
    totalBranches,
  } = useBranchSearch();

  useEffect(() => {
    setApiSearchTerm(globalSearchTerm);
  }, [globalSearchTerm, setApiSearchTerm]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const toggleFilterModal = useCallback(() => {
    setIsFilterModalOpen((prev) => !prev);
  }, []);

  const handleMapNavigation = useCallback(() => {
    navigate("/coffeelover/map-coffelover");
  }, [navigate]);

  const handleGlobalSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setGlobalSearchTerm(e.target.value);
    },
    []
  );

  const handleScanSuccess = useCallback((result: string) => {
    setIsScannerOpen(false);

    if (result && result.startsWith("http")) {
      window.location.href = result;
    } else {
      console.log("Código QR escaneado:", result);
    }
  }, []);

  const searchActions = [
    {
      icon: <Filter size={16} className="text-[#6F4E37]" />,
      onClick: toggleFilterModal,
      ariaLabel: "Abrir filtros",
    },
    {
      icon: <MapPin size={16} className="text-blue-500" />,
      onClick: handleMapNavigation,
      ariaLabel: "Ir al mapa",
    },
  ];

  
  return (
    <div className="flex flex-col max-w-full  overflow-x-hidden h-full relative">
      <CoffeeBackground
        coffeeCount={10}
        circleCount={6}
        opacity={70}
        zIndex={0}
        gradientFrom="#FFFDF9"
        gradientTo="#FAF3E0"
      />
      <div className="sticky flex flex-col items-center top-0 z-10 bg-opacity-30  backdrop-blur-sm transition-all duration-300">
        <div className="flex flex-col gap-3 w-full md:min-w-7xl items-center p-4">
          <SearchCoffee
            value={globalSearchTerm}
            onChange={handleGlobalSearchChange}
            className="mb-2"
            placeholder="Buscar cafeterías..."
            actions={searchActions}
          />
        </div>
      </div>

      <div
        className={`flex flex-col gap-6 max-h-[85vh] xl:w-7xl mx-auto w-full overflow-auto relative z-10 pb-4 ${
          isMobile ? "pb-24" : ""
        }`}
      >
       <div>
         <FeaturedStoresWidget
          globalSearchTerm={globalSearchTerm}
          setGlobalSearchTerm={setGlobalSearchTerm}
          apiFilteredBranches={apiBranches}
          apiIsLoading={apiIsLoading}
          hasActiveFilters={apiHasActiveFilters}
        />
       </div>
        <div className="p-4">
          <EventList/>
        </div>
      </div>

      <div
        className={`fixed ${isMobile ? "bottom-20" : "bottom-6"} right-6 z-20`}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {isMobile ? (
                <Button
                  onClick={() => setIsScannerOpen(true)}
                  className="h-12 px-4 rounded-full bg-amber-600 hover:bg-amber-700 shadow-lg flex items-center gap-2"
                  aria-label="Registrar visita con QR"
                >
                  <QrCode className="h-5 w-5 text-white flex-shrink-0" />
                  <span className="text-white text-sm font-medium whitespace-nowrap">
                    Registrar visita
                  </span>
                </Button>
              ) : (
                <div className="relative">
                  <Button
                    onClick={() => setIsScannerOpen(true)}
                    className="h-14 w-14 rounded-full bg-amber-600 hover:bg-amber-700 shadow-lg flex items-center justify-center"
                    aria-label="Registrar visita con QR"
                  >
                    <QrCode className="h-6 w-6 text-white" />
                  </Button>
                </div>
              )}
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="bg-amber-50 border border-amber-200"
            >
              <p className="text-amber-800 font-medium">
                Escanea el QR para registrar tu visita
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <QRScannerDialog
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={toggleFilterModal}
        filterOptions={apiFilters}
        updateFilterOptions={updateApiFilters}
        resetFilters={resetApiFilters}
        hasActiveFilters={apiHasActiveFilters}
        totalResults={totalBranches}
        isLoading={apiIsLoading}
      />
    </div>
  );
}
