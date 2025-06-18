
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';
import { EventDto} from '@/api/types/events/events.types';
import { Clock, MapPin, User } from 'lucide-react';
import { Badge } from '@/common/ui/badge';



interface EventCardProps {
    event: EventDto
}


export default function EventCard({event}:EventCardProps) {

    const colors = [
        "bg-red-100 border-red-200 text-red-800",
        "bg-blue-100 border-blue-200 text-blue-800",
        "bg-yellow-100 border-yellow-200 text-yellow-800",
        "bg-green-100 border-green-200 text-green-800",
        "bg-purple-100 border-purple-200 text-purple-800"
    ];
    const colorClass = colors[(typeof event.id === 'number' ? event.id : 0) % colors.length];

    return (

        <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: (typeof event.id ==='number' ? event.id:0) * 0.1 }}
            className="relative "
        >

            {/* Event card */}
            <div className={`rounded-xl p-4 min-h-[20vh] border ${colorClass} shadow-sm`}>
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">{event.name}</h3>
                    <div className="text-right font-medium flex space-x-2">
                        <p>
                            {format(parseISO(event.start_date), 'dd MMM yyyy', { locale: es })}
                        </p>
                        <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {format(parseISO(event.start_date), 'h:mm a')}
                        </span>
                    </div>
                </div>
                <p className="mt-2 text-sm opacity-80">{event.description}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                    <div className="flex items-center text-xs opacity-70">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                    </div>
                    <div className="flex items-center text-xs opacity-70">
                        <User className="h-3 w-3 mr-1" />
                        {event.organizer}
                    </div>
                    <Badge variant="outline" className="text-xs">
                        {event.is_free ? 'Gratis' : `$${event.value}`}
                    </Badge>
                </div>
            </div>
        </motion.div>

    )
}