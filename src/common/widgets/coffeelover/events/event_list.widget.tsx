import { useEventAll } from "@/api/queries/events/events.query"
import { EventCard } from "@/common/molecules/coffeelover/events/event_card.molecule"

export function EventList() {
    const { data: events } = useEventAll()

    return (
        <div className="space-y-4 xs:space-y-6">
            <h2 className="text-lg font-bold">Últimas Novedades</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {events?.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </div>
    )
}
