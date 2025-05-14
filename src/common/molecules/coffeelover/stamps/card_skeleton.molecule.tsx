import { Card, CardContent } from "@/common/ui/card"

export const CardStampSkeleton =  () => {
    return (
        <div className="h-64 transform transition-all duration-300 hover:translate-y-[-4px]">
        <Card className="bg-white h-full border-none shadow-md relative overflow-hidden">
            {/* Postage stamp serrated edges effect */}
            <div className="absolute top-0 right-0 bottom-0 left-0 border-[10px] border-white z-10 
                [mask-image:repeating-linear-gradient(0deg,transparent,transparent_8px,black_8px,black_16px),
                repeating-linear-gradient(90deg,transparent,transparent_8px,black_8px,black_16px),
                repeating-linear-gradient(180deg,transparent,transparent_8px,black_8px,black_16px),
                repeating-linear-gradient(270deg,transparent,transparent_8px,black_8px,black_16px)]"></div>

            <div className="absolute inset-0 bg-[radial-gradient(#f3f3f3_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-orange-300 to-amber-500"></div>

            <CardContent className="p-0 h-full flex flex-col">
                <div className="flex-1 bg-cream-100 animate-pulse h-40 relative">
                    <div className="absolute inset-0 border-[8px] border-dashed border-orange-200/20"></div>
                </div>
                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-100 animate-pulse">
                    <div className="h-6 bg-orange-200/60 rounded-md w-3/4 mb-2"></div>
                    <div className="h-4 bg-orange-100/40 rounded-md w-1/2"></div>
                </div>
            </CardContent>
        </Card>
    </div>
    )
}