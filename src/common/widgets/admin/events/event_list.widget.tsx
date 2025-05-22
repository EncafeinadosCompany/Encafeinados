import { useEventAll } from "@/api/queries/events/events.query";
import { useState, useEffect } from "react";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/common/ui/card";
import { Badge } from "@/common/ui/badge";
import { EvenType } from "@/api/types/events/events.types";
import { Input } from "@/common/ui/input";

export const EventList = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewAll, setViewAll] = useState(false);
  const { data: events, isLoading, isError, refetch } = useEventAll();
  const [filteredEvents, setFilteredEvents] = useState<EvenType[]>([]);
  const [daysWithEvents, setDaysWithEvents] = useState<number[]>([]);

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
            <h2 className="text-2xl font-bold text-white flex items-center">
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
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                disabled={viewAll}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleNextMonth}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                disabled={viewAll}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
              <Button 
                variant={viewAll ? "default" : "outline"}
                onClick={viewAll ? () => setViewAll(false) : handleViewAll}
                className={viewAll 
                  ? "bg-white text-[#6F4E37] hover:bg-white/90" 
                  : "bg-white/20 hover:bg-white/30 text-white border-white/30"}
              >
                {viewAll ? "Ver por mes" : "Ver todos"}
              </Button>
              <Button className="bg-white text-[#6F4E37] hover:bg-white/90">
                <Plus className="h-5 w-5 mr-1" />
                Nuevo Evento
              </Button>
            </div>
          </div>
          
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
            <Input
              placeholder="Buscar eventos..."
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                    className={`flex flex-col items-center cursor-pointer transition-all ${
                      isSelected ? 'scale-110' : 'hover:scale-105'
                    }`}
                  >
                    <div className="text-gray-400 text-sm">
                      {format(date, 'EEE', { locale: es })}
                    </div>
                    <div 
                      className={`w-7 h-7 rounded-full flex items-center justify-center mt-1 ${
                        isSelected 
                          ? 'bg-[#F5E4D2] text-[#6F4E37] text-xs font-bold' 
                          : hasEvents 
                            ? 'bg-white/30 text-white' 
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
        <div className="p-6">
          {filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Coffee className="h-16 w-16 text-[#6F4E37]/30 mb-4" />
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
                <Plus className="h-4 w-4 mr-2" />
                Crear Evento
              </Button>
            </div>
          ) : (
            <div className="relative pl-8 max-h-[55vh] overflow-y-auto">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#6F4E37]/20"></div>
              
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
                    className="mb-8 relative"
                  >
                    {/* Timeline dot */}
                    <div className={`absolute -left-8 top-4 w-4 h-4 rounded-full border-4 border-white ${
                      index === 0 ? 'bg-[#6F4E37]' : 'bg-white'
                    }`}></div>
                    
                    {/* Event card */}
                    <div className={`rounded-xl p-4 border ${colorClass} shadow-sm`}>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg">{event.name}</h3>
                        <div className="text-right font-medium">
                          {format(parseISO(event.start_date), 'h:mm a')}
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
        </div>
      </div>
    </div>
  );
}