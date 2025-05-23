import { useEventAll } from "@/api/queries/events/events.query";
import { useState, useEffect, useRef } from "react";
import { format, parseISO, isSameMonth, addMonths, subMonths, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    Coffee,
    Loader2,
    MapPin,
    Plus,
    RefreshCw,
    Search,
    User,
    X
} from "lucide-react";
import { Button } from "@/common/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/common/ui/card";
import { Badge } from "@/common/ui/badge";
import { EvenType } from "@/api/types/events/events.types";
import { Input } from "@/common/ui/input";
import { ScrollIndicator } from "@/common/atoms/indicator";

export const EventList = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewAll, setViewAll] = useState(false);
    const { data: events, isLoading, isError, refetch } = useEventAll();
    const [filteredEvents, setFilteredEvents] = useState<EvenType[]>([]);
    const [daysWithEvents, setDaysWithEvents] = useState<number[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (events) {
            let filtered = events;

            // Filter by search term
            if (searchTerm) {
                filtered = filtered.filter((event: EvenType) =>
                    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // Filter by month if not viewing all
            if (!viewAll) {
                if (selectedDay) {
                    filtered = filtered.filter((event: EvenType) =>
                        !!event.start_date && isSameDay(parseISO(event.start_date), selectedDay)
                    );
                } else {
                    filtered = filtered.filter((event: EvenType) =>
                        !!event.start_date && isSameMonth(parseISO(event.start_date), currentMonth)
                    );
                }
            }

            // Sort by date
            filtered = [...filtered].sort((a, b) =>
                new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
            );

            setFilteredEvents(filtered);

            // Calculate days with events for the current month
            if (events) {
                const days = events
                    .filter((event: EvenType) => !!event.start_date && isSameMonth(parseISO(event.start_date), currentMonth))
                    .map((event: EvenType) => new Date(event.start_date).getDate());
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
        return (
            <div className="flex flex-col items-center justify-center h-64 w-full">
                <Loader2 className="h-10 w-10 text-[#6F4E37] animate-spin mb-4" />
                <p className="text-[#6F4E37] text-lg font-medium">Cargando eventos...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <Card className="w-full bg-red-50 border-red-100">
                <CardHeader className="space-y-1 flex flex-col items-center text-center p-6">
                    <X className="h-12 w-12 text-red-500 mb-2" />
                    <CardTitle className="text-xl text-red-700">Error al cargar eventos</CardTitle>
                    <CardDescription className="text-red-600">
                        No pudimos cargar los eventos. Por favor, intenta nuevamente.
                    </CardDescription>
                    <Button
                        onClick={() => refetch()}
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reintentar
                    </Button>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="container h-[98vh] mx-auto p-4 overflow-hidden">
            <div className="bg-white rounded-xl h-full shadow-md border border-[#D4A76A]/20 overflow-hidden">
                {/* Header with month navigation and search */}
                <div className="bg-white p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-[#DB8935] flex items-center">
                            <Calendar className="mr-2 h-6 w-6" />
                            {selectedDay
                                ? format(selectedDay, 'dd MMMM yyyy', { locale: es })
                                : viewAll
                                    ? 'Todos los eventos'
                                    : format(currentMonth, 'MMMM yyyy', { locale: es })}
                        </h2>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handlePreviousMonth}
                                className="bg-amber-600 rounded-full hover:bg-gray-400 text-white border-white/30"
                                disabled={viewAll}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleNextMonth}
                                className="bg-amber-600 rounded-full hover:bg-gray-400 text-white border-white/30"
                                disabled={viewAll}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewAll ? "default" : "outline"}
                                onClick={viewAll ? () => setViewAll(false) : handleViewAll}
                                className={viewAll
                                    ? "bg-black border-black text-white hover:bg-gray-700 rounded-full"
                                    : "bg-white hover:bg-gray-100 text-amber-600 border-amber-600 rounded-full"}
                            >
                                {viewAll ? "Ver eventos por mes" : "Ver todos los eventos"}
                            </Button>
                            <a href={`/admin/form`} className="bg-black  font-bold  flex items-center px-2 text-[14px] text-white rounded-full hover:bg-gray-600/90">
                                <Plus className="h-5 w-5 mr-1" />
                                <span className="me-2"> Nuevo Evento</span>
                            </a>
                        </div>
                    </div>

                    {/* Search bar */}
                    <div
                        className="w-full grid justify-center "
                        onFocus={() => setIsSearching(true)}
                        onBlur={() => setIsSearching(false)}
                    >
                        <div className="mb-6 text-center">
                            <div className="flex gap-4 justify-center mt-4">
                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="h-4 w-4 mr-1 text-[#DB8935]" />
                                    <span>Organiza por fecha</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Coffee className="h-4 w-4 mr-1 text-[#DB8935]" />
                                    <span>Gestiona actividades</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <User className="h-4 w-4 mr-1 text-[#DB8935]" />
                                    <span>Asigna organizadores</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative ">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                placeholder="Buscar eventos..."
                                className={`border-gray-400 bg-gray-50  text-gray-700 placeholder:text-gray-700 pl-10 rounded-full transition-all duration-300  ${isSearching ? 'md:w-4xl ring-2 ring-[#6F4E37]' : 'md:w-2xl'
                                    }`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Calendar days */}
                    {!viewAll && (
                        <div className="flex justify-center mt-4 space-x-4 overflow-x-auto py-2">
                            {Array.from({ length: 7 }, (_, i) => {
                                const date = new Date(currentMonth);
                                date.setDate(i + 11); // Starting from day 11 as in the image
                                const day = date.getDate();
                                const hasEvents = daysWithEvents.includes(day);
                                const isSelected = selectedDay && selectedDay.getDate() === day;

                                return (
                                    <div
                                        key={i}
                                        onClick={() => handleDayClick(day)}
                                        className={`flex flex-col items-center cursor-pointer transition-all ${isSelected ? 'scale-110' : 'hover:scale-105'
                                            }`}
                                    >
                                        <div className="text-gray-400 text-sm">
                                            {format(date, 'EEE', { locale: es })}
                                        </div>
                                        <div
                                            className={`w-7 h-7 rounded-full flex items-center justify-center mt-1 ${isSelected
                                                ? 'bg-[#F5E4D2] text-[#6F4E37] text-xs font-bold'
                                                : hasEvents
                                                    ? 'bg-white/30 text-[#d2b38e]'
                                                    : 'text-gray-300'
                                                }`}
                                        >
                                            {day}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Events timeline */}
                <div className="p-4">
                    {filteredEvents.length === 0 ? (
                        <div className="flex flex-col md:max-h-[40vh] items-center justify-center py-10 text-center">

                            <div className="h-50 w-50">

                                <img src="/undraw_schedule_6t8k.svg" alt="" />
                            </div>
                            <h3 className="text-xl font-medium text-[#2C1810] mb-2">No hay eventos</h3>
                            <p className="text-[#6F4E37] max-w-md">
                                {searchTerm
                                    ? `No se encontraron resultados para "${searchTerm}"`
                                    : selectedDay
                                        ? `No hay eventos programados para ${format(selectedDay, 'dd MMMM yyyy', { locale: es })}`
                                        : viewAll
                                            ? 'No hay eventos programados'
                                            : `No hay eventos programados para ${format(currentMonth, 'MMMM yyyy', { locale: es })}`
                                }
                            </p>
                            <Button className="mt-6 bg-[#6F4E37] hover:bg-[#5C4130] text-white">
                                <a href={`/admin/form?start_time=${selectedDay ? format(selectedDay, 'dd MMMM yyyy', { locale: es }) : format(new Date(), 'dd MMMM yyyy', { locale: es })}`} className="flex items-center">
                                    <Plus className="h-4 w-4 mr-2" />
                                    <span className="me-2">Crear Evento</span>
                                </a>
                            </Button>
                        </div>
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


                            {filteredEvents.map((event: EvenType, index) => {
                                // Determine color based on index for variety
                                const colors = [
                                    "bg-red-100 border-red-200 text-red-800",
                                    "bg-blue-100 border-blue-200 text-blue-800",
                                    "bg-yellow-100 border-yellow-200 text-yellow-800",
                                    "bg-green-100 border-green-200 text-green-800",
                                    "bg-purple-100 border-purple-200 text-purple-800"
                                ];
                                const colorClass = colors[index % colors.length];

                                return (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
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
                                );
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