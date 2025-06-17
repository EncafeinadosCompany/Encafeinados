import { useClientEventMutation } from "@/api/mutations/events/events.mutation"
import { useClientEvent, useEventAll } from "@/api/queries/events/events.query"
import { EventCard } from "@/common/molecules/coffeelover/events/event_card.molecule"
import { useLocalStorage } from "@/common/utils/security/auth_storage.utils";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";


export function EventList() {
    const { data: events } = useEventAll()
    const { mutateAsync: clientEvent, status } = useClientEventMutation();
    const [joinedEventIds, setJoinedEventIds] = useState<number[]>([]);

    const idClient = useLocalStorage('userId')
    if(!idClient) {
        toast.error('No se pudo obtener el id del cliente');
        return null; 
    }

    const { data: event_client } = useClientEvent(idClient!, {
        queryKey: ['clientEvent', idClient],
        enabled: !!idClient
      });

    useEffect(() => {
        if (event_client ) {
            setJoinedEventIds(event_client .map(event => event.idEvent ?? 0));
          } else {
            setJoinedEventIds([]);
          }
    },[event_client])

    

    const hadleClient = async (eventId: number) => {
        console.log(eventId);
        await clientEvent(eventId);
    }

    return (
        <div className="space-y-4 xs:space-y-6">
            <h2 className="text-lg font-bold">Últimas Novedades</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {events?.map((event) => (
                    <EventCard 
                        event_client={joinedEventIds} 
                        handleClient={hadleClient} 
                        status={status} 
                        key={event.id} 
                        event={event} />
                ))}
            </div>
        </div>
    )
}
