import { NavItemType } from "@/common/types/navTypes"
import { Home, Search, Bell, Settings, User} from "@/common/ui/icons"
import { Book } from "lucide-react"

export const CoffeloverItems: NavItemType[] = [
    {
      title: "Inicio",
      href: "/coffeelover",
      icon: <Home className="h-4 w-4" />
    },
    {
      title: "Álbum",
      href: "/coffeelover/album",
      icon: <Book className="h-4 w-4" />
    }
  ]