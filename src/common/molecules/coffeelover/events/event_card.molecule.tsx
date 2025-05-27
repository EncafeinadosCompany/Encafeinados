import { EvenType } from "@/api/types/events/events.types"
import { MapPin, Clock, Coffee } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/common/ui/button"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/common/ui/dialog"

interface EventCardProps {
    event: EvenType
    event_client: number[]
    handleClient: (eventId: number) => void
    status: any
}

export function EventCard({ event, handleClient, status, event_client }: EventCardProps) {
    // Format the date to extract day and month
    const date = new Date(event.start_date)
    const day = date.getDate()
    const month = date.toLocaleString("es-ES", { month: "short" })
    // Format time
    const formattedTime = format(date, "h:mm a", { locale: es })

    const [isDialogOpen, setIsDialogOpen] = useState(false)

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

                    <div className="mb-3">
                        <p 
                            className="text-gray-600 text-xs xs:text-sm line-clamp-2 cursor-pointer hover:text-amber-700 transition-colors duration-200"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            {event.description}
                        </p>
                        
                        {/* Dialog for event description */}
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent className="sm:max-w-md bg-white border-none">
                            <DialogHeader className="border-b border-gray-400 pb-3">
                                    <DialogTitle className="text-amber-800 text-xl font-bold flex items-center">
                                        {event.name}
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="mt-2 text-gray-700 max-h-[60vh] overflow-y-auto">
                                    <p>{event.description}</p>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <MapPin size={16} className="mr-1 text-amber-500" />
                                        <span>{event.location}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock size={16} className="mr-1 text-amber-500" />
                                        <span>{formattedTime}</span>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
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
                    disabled={status === "loading" || status === "success" || Boolean(event_client.find((e)=> e === event.id) || new Date(event.end_date) < new Date())}
                    className="px-3 py-1.5 xs:px-4 xs:py-2 rounded-md  disabled:bg-gray-400 disabled:text-gray-900 bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs xs:text-sm transition-colors duration-200 shadow-sm"
                >
                    {event_client.includes(event.id as number) ?
                      
                     "Ya te encuentras inscrito" : 
                     new Date(event.end_date) < new Date()?
                     "Evento finalizado" :
                     "Inscribirme"        
                     }
                </Button>
            </div>
        </div>
    )
}