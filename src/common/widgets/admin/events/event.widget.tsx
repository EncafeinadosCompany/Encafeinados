import { useEventAll } from "@/api/queries/events/events.query";
import { useState, useEffect, useRef } from "react";
import { parseISO, isSameMonth, addMonths, subMonths, isSameDay } from "date-fns";

import { EventDto } from "@/api/types/events/events.types";
import { ScrollIndicator } from "@/common/atoms/indicator";
import EventCard from "@/common/molecules/admin/event/event_card.molecule";
import { StatusFeedbackEvent } from "@/common/molecules/admin/event/event_status_feedback.molecule";
import HeaderEventMonth from "@/common/molecules/admin/event/event_header_month.molecule";


export default function EventList() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewAll, setViewAll] = useState(false);
    const { data: events, isLoading, isError, refetch } = useEventAll();
    const [filteredEvents, setFilteredEvents] = useState<EventDto[]>([]);
    const [daysWithEvents, setDaysWithEvents] = useState<number[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (events) {
            let filtered = events;
            if (searchTerm) {
                filtered = filtered.filter((event: EventDto) =>
                    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            if (!viewAll) {
                if (selectedDay) {
                    filtered = filtered.filter((event: EventDto) =>
                        !!event.start_date && isSameDay(parseISO(event.start_date), selectedDay)
                    );
                } else {
                    filtered = filtered.filter((event: EventDto) =>
                        !!event.start_date && isSameMonth(parseISO(event.start_date), currentMonth)
                    );
                }
            }

            // Sort by date
            filtered = [...filtered].sort((a, b) =>
                new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
            );

            setFilteredEvents(filtered);

            if (events) {
                const days = events
                    .filter((event: EventDto) => !!event.start_date && isSameMonth(parseISO(event.start_date), currentMonth))
                    .map((event: EventDto) => new Date(event.start_date).getDate());
                setDaysWithEvents([...new Set(days)]);
            }
        }
    }, [events, currentMonth, selectedDay, searchTerm, viewAll]);

    const handlePreviousMonth = () => {
        setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
        setSelectedDay(null);
    };

    const handleNextMonth = () => {
        setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
        setSelectedDay(null);
    };

    const handleDayClick = (day: number) => {
        const newDate = new Date(currentMonth);
        newDate.setDate(day);
        setSelectedDay(newDate);
        setViewAll(false);
    };

    const handleViewAll = () => {
        setViewAll(true);
        setSelectedDay(null);
    };

    if (isLoading) {
        <StatusFeedbackEvent status="loading" message="Cargando eventos..." refetch={refetch} />
    }

    if (isError) {
        <StatusFeedbackEvent status="error" /> 
    }

    return (
        <div className="container h-full mx-auto p-4 overflow-hidden">
            <div className="bg-white rounded-xl h-full shadow-md border border-[#D4A76A]/20 overflow-hidden">

                {/* Header with month navigation and search */}
                <HeaderEventMonth
                    handleDayClick={handleDayClick}
                    selectedDay={selectedDay}
                    currentMonth={currentMonth}
                    daysWithEvents={daysWithEvents}
                    viewAll={viewAll}
                    setViewAll={setViewAll}
                    handlePreviousMonth={handlePreviousMonth}
                    handleNextMonth={handleNextMonth}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    isSearching={isSearching}
                    setIsSearching={setIsSearching}
                    handleViewAll={handleViewAll}
                />

                {/* Events timeline */}
                <div className="p-4">
                    {filteredEvents.length === 0 ? (
                        <StatusFeedbackEvent
                            status="empty"
                            searchTerm={searchTerm}
                            selectedDay={selectedDay}
                            viewAll={viewAll}
                            currentMonth={currentMonth}
                        />

                    ) : (
                        <div
                            ref={scrollContainerRef}
                            className="relative pl-4 flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 scrollbar-subtle pb-16"
                            style={{
                                height: 'auto',
                                maxHeight: 'calc(100vh - 320px)',
                                overflowY: 'auto',
                                paddingBottom: '80px'
                            }}
                        >
                            {filteredEvents.map((event: EventDto) => {
                                return (
                                    <EventCard event={event} />
                                )
                            })}
                        </div>
                    )}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                        <ScrollIndicator className="bg-[#6F4E37]/10 hover:bg-[#6F4E37]/20" containerRef={scrollContainerRef as React.RefObject<HTMLElement>}></ScrollIndicator>
                    </div>

                </div>
            </div>
        </div>
    );
}