import { useEventAll, useEventByStatus} from "@/api/queries/events/events.query"
import { EventCard } from "@/common/molecules/coffeelover/events/event_card.molecule"

export function EventList() {

    const {data:events} = useEventByStatus()

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Ultimas Novedades</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
