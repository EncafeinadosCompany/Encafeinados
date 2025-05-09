import { Card, CardContent } from "@/common/ui/card";
import { Skeleton } from "@/common/ui/skeleton";

export const renderSkeletons = () => {
    return Array(3).fill(0).map((_, index) => (
      <div key={index} className="h-[220px]">
        <Card className="h-full bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-md bg-gradient-to-br from-gray-200 to-gray-100 animate-pulse" />
                <div>
                  <Skeleton className="h-4 w-36 mb-2 bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse rounded-md" />
                  <Skeleton className="h-3 w-24 bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse rounded-md" />
                </div>
              </div>
              <Skeleton className="h-5 w-16 rounded-full bg-gradient-to-r from-amber-100 to-orange-50 animate-pulse" />
            </div>
            <div className="space-y-3 mt-4">
              <div className="flex gap-2">
                <Skeleton className="h-4 w-4 rounded-full bg-gradient-to-br from-gray-200 to-gray-100 animate-pulse" />
                <Skeleton className="h-4 w-full bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse rounded-md" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-4 w-4 rounded-full bg-gradient-to-br from-gray-200 to-gray-100 animate-pulse" />
                <Skeleton className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse rounded-md" />
              </div>
            </div>
            <div className="mt-6">
              <Skeleton className="h-8 w-full rounded-md bg-gradient-to-r from-[#D4A76A]/30 to-[#6F4E37]/30 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    ));
  };