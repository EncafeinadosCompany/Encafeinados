import { FlameIcon as Fire } from "@/common/ui/icons";
import { Card, CardContent } from "@/common/ui/card";

interface FeaturedCardProps {
  title: string;
  image: string;
  location: string;
  address: string;
  tag?: string;
}

export default function FeaturedCard({
  title = "Azahar Coffee",
  image = "/placeholder.svg",
  location = "Burien, WA 98168",
  address = "103 Wright Court",
  tag = "Popular",
}: FeaturedCardProps) {


  return (
    <div className="max-w-xs">
      <Card className="overflow-hidden border border-gray-200/60 shadow-md hover:shadow-lg transition-shadow duration-300 mb-2">
        <CardContent className="p-0 relative">
          <div className="relative h-48 w-full">
            <img
              src={image || "/placeholder.svg"}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-3 left-3">
            <div className="bg-[#F5E4D2]  text-black text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <Fire className="h-4 w-4" />
              <span>{tag}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="px-1">
        <h3 className="font-semibold font-SF-pro text-base">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {address}, {location}
        </p>
      </div>
    </div>
  );
}
