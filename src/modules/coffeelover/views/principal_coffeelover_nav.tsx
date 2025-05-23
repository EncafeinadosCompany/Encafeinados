import { FeaturedStoresWidget } from '@/common/widgets/coffeelover/stores/feature_stores.widget'
import SearchCoffee from '@/common/atoms/search';
import { useState, useCallback, useEffect } from 'react';
import { QrCode } from 'lucide-react';
import { CoffeeBackground } from '@/common/widgets/coffee_background.widget';
import QRScannerDialog from '@/common/molecules/coffeelover/stores/QR_scanner_dialog.molecule';
import { Button } from '@/common/ui/button';
import { EventList } from '@/common/widgets/coffeelover/events/event_list.widget';

const PrincipalCoffeelover = () => {
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleGlobalSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalSearchTerm(e.target.value);
  }, []);

  const handleScanSuccess = useCallback((result: string) => {
    setIsScannerOpen(false);

    if (result && result.startsWith('http')) {
      window.location.href = result;
    } else {
      console.log('Código QR escaneado:', result);
    }
  }, []);

  return (
    <div className='flex flex-col max-w-full  overflow-hidden h-full relative'>
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
          />
        </div>
      </div>

      <div className={`flex flex-col p-4 gap-6 max-h-[85vh] xl:w-7xl mx-auto w-full overflow-auto relative z-10 pb-4 ${isMobile ? 'pb-24' : ''}`}>
        <FeaturedStoresWidget
          globalSearchTerm={globalSearchTerm}
          setGlobalSearchTerm={setGlobalSearchTerm}
        />
        <EventList>         
        </EventList>
      </div>

      <div className={`fixed ${isMobile ? 'bottom-20' : 'bottom-6'} right-6 z-20`}>
        <Button
          onClick={() => setIsScannerOpen(true)}
          className="h-14 w-14 rounded-full bg-amber-600 hover:bg-amber-700 shadow-lg flex items-center justify-center"
          aria-label="Escanear código QR"
        >
          <QrCode className="h-6 w-6 text-white" />
        </Button>
      </div>

      <QRScannerDialog
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  )
}

export default PrincipalCoffeelover