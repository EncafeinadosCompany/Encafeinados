import { EvenType } from "@/api/types/events/events.types"
import { MapPin, Clock, Coffee } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useNavigate } from "react-router-dom"
import { Button } from "@/common/ui/button"

interface EventCardProps {
    event: EvenType
    handleClient: (eventId: number) => void
    status: any
}

export function EventCard({ event, handleClient, status }: EventCardProps) {
    // Format the date to extract day and month
    const date = new Date(event.start_date)
    const day = date.getDate()
    const month = date.toLocaleString("es-ES", { month: "short" })
    const navigate = useNavigate()
    // Format time
    const formattedTime = format(date, "h:mm a", { locale: es })

    return (
        <div className="rounded-lg bg-white border border-gray-100 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full">
            <div className="flex flex-col xs:flex-row flex-1">
                {/* Left side with date */}
                <div className="p-3 xs:p-4 flex justify-start xs:justify-center xs:flex-col xs:items-center">
                    <div className="bg-white rounded-lg p-2 shadow-sm flex flex-row xs:flex-col items-center xs:justify-center text-center min-w-16 min-h-[60px] gap-2 xs:gap-0">
                        <span className="text-lg font-bold text-amber-700">{day}</span>
                        <span className="text-xs capitalize text-amber-600">{month}</span>
                    </div>
                </div>

                {/* Right side with event details */}
                <div className="p-3 xs:p-4 flex-1">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                        <h3 className="text-base xs:text-xl font-bold text-gray-800 mb-1 xs:mb-2 line-clamp-2 break-words flex-1">{event.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            event.is_free ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                            {event.is_free ? "Gratis" : `$${event.value}`}
                        </span>
                    </div>

                    <div className="relative group mb-3">
                        <p className="text-gray-600 text-xs xs:text-sm line-clamp-2 cursor-help">{event.description}</p>
                        <div className="absolute z-20 invisible opacity-0 group-hover:visible group-hover:opacity-100 touch:opacity-0 touch:invisible md:touch:hover:visible md:touch:hover:opacity-100 top-0 left-0 mt-6 w-64 max-w-[90vw] bg-white border border-gray-200 text-gray-800 text-sm rounded-lg p-3 shadow-lg transition-all duration-200">
                            <div className="max-h-32 overflow-y-auto">
                                {event.description}
                            </div>
                            <div className="absolute top-[-6px] left-4 w-3 h-3 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs xs:text-sm">
                        <div className="flex items-center text-gray-500">
                            <MapPin size={14} className="mr-1 text-amber-500 flex-shrink-0" />
                            <span className="line-clamp-1 break-all">{event.location}</span>
                        </div>

                        <div className="flex items-center text-gray-500">
                            <Clock size={14} className="mr-1 text-amber-500 flex-shrink-0" />
                            <span>{formattedTime}</span>
                        </div>

                        {event.organizer && (
                            <div className="flex items-center text-gray-500">
                                <Coffee size={14} className="mr-1 text-amber-500 flex-shrink-0" />
                                <span className="line-clamp-1">Organizado por: <span className="font-medium">{event.organizer}</span></span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-end mt-auto">
                <Button
                    onClick={() => handleClient(event.id as number)}
                    disabled={status === "loading" || status === "success"}
                    className="px-3 py-1.5 xs:px-4 xs:py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs xs:text-sm transition-colors duration-200 shadow-sm"
                >
                    Inscribirme
                </Button>
            </div>
        </div>
    )
}