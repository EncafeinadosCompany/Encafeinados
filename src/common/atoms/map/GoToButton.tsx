import { Button } from "@/common/ui/button"
import { MapPinIcon } from "lucide-react"

export const GoToButton = ({text, ...props}: React.ComponentProps<"button"> & { text: string }) => {
    return ( 
        <Button 
          className="bg-[#DB8935] hover:bg-[#C77830] text-white font-medium rounded-full 
            transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg 
            w-full flex items-center justify-center gap-2 order-1 sm:order-2"
            {...props}
        >
          <MapPinIcon className="h-5 w-5" />
          <span>Visitar {text}</span>
        </Button>
    )
} 