import { EvenType } from "@/api/types/events/events.types"
import { MapPin, Clock, Coffee } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useNavigate } from "react-router-dom"
import { Button } from "@/common/ui/button"

interface EventCardProps {
    event: EvenType
}

export function EventCard({ event }: EventCardProps) {
    // Format the date to extract day and month
    const date = new Date(event.start_date)
    const day = date.getDate()
    const month = date.toLocaleString("es-ES", { month: "short" })
    const navigate = useNavigate()
    // Format time
    const formattedTime = format(date, "h:mm a", { locale: es })

    return (
        <div className="rounded-lg max-h-[30vh] bg-white border border-gray-100 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex flex-row">
                {/* Left side with date */}
                <div className="p-4 flex flex-col items-center justify-center">
                    <div className="bg-white rounded-lg p-2 shadow-sm flex flex-col items-center justify-center text-center w-16 h-16">
                        <span className="text-lg font-bold text-amber-700">{day}</span>
                        <span className="text-xs capitalize text-amber-600">{month}</span>
                    </div>
                </div>

                {/* Right side with event details */}
                <div className="p-4 flex-1 min-h-44">
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{event.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${event.is_free
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                            }`}>
                            {event.is_free ? "Gratis" : `$${event.value}`}
                        </span>
                    </div>

                                        <div className="relative group">
                        <p className="text-gray-600 text-sm line-clamp-1 mb-3 cursor-help">{event.description}</p>
                        <div className="absolute z-20 invisible opacity-0 group-hover:visible group-hover:opacity-100 md:group-hover:visible md:group-hover:opacity-100 touch:opacity-100 touch:visible top-0 left-0 mt-6 w-64 max-w-[90vw] bg-white border border-gray-200 text-gray-800 text-sm rounded-lg p-3 shadow-lg transition-all duration-200">
                            <div className="max-h-20 h-50 overflow-y-auto">
                                {event.description}
                            </div>
                            <div className="absolute top-[-6px] left-4 w-3 h-3 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center text-gray-500 text-sm">
                            <MapPin size={14} className="mr-1 text-amber-500" />
                            <span className="line-clamp-1">{event.location}</span>
                        </div>

                        <div className="flex items-center text-gray-500 text-sm">
                            <Clock size={14} className="mr-1 text-amber-500" />
                            <span>{formattedTime}</span>
                        </div>

                        {event.organizer && (
                            <div className="flex items-center text-gray-500 text-sm">
                                <Coffee size={14} className="mr-1 text-amber-500" />
                                <span>Organizado por: <span className="font-medium">{event.organizer}</span></span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-end">
                <Button
                    onClick={() => navigate(`/coffeelover/album`)}
                    className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm transition-colors duration-200 inline-block shadow-sm"
                >
                    Inscribirme
                </Button>
            </div>
        </div>
    )
}