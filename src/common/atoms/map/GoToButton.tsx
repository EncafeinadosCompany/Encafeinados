import { Button } from "@/common/ui/button"
import { MapPinIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface GoToButtonProps extends Omit<React.ComponentProps<typeof Button>, 'onClick'> {
  text: string;
  branchId?: number;
  mapRoute?: 'public' | 'private'; 
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const GoToButton = ({
  text,
  branchId,
  mapRoute = 'public',
  onClick,
  ...props
}: GoToButtonProps) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
    
    if (branchId) {
      const baseRoute = mapRoute === 'public' ? 'map' : '/coffeelover/map-coffelover';
      console.log(baseRoute,branchId)
      navigate(`${baseRoute}?cafeId=${branchId}`);
    }
  };

  return (
    <Button 
      className="bg-[#DB8935] hover:bg-[#C77830] text-white font-medium rounded-full 
        transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg 
        w-full flex items-center justify-center gap-2 order-1 sm:order-2"
      onClick={handleClick}
      {...props}
    >
      <MapPinIcon className="h-5 w-5" />
      <span>Visitar {text}</span>
    </Button>
  );
}