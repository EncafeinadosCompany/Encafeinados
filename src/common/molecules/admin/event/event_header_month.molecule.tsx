import { Button } from "@/common/ui/button";
import { Input } from "@/common/ui/input";
import { format } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, Coffee, Plus, Search, User } from "lucide-react";
import { es } from "date-fns/locale";

interface HeaderEventMonthProps {
    selectedDay?: Date | null;
    currentMonth: Date;
    daysWithEvents: number[];
    viewAll: boolean;
    setViewAll: (viewAll: boolean) => void;
    handlePreviousMonth: () => void;
    handleNextMonth: () => void;
    handleDayClick: (day: number) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    isSearching: boolean;
    setIsSearching: (isSearching: boolean) => void;
    handleViewAll: () => void;
}


export default function HeaderEventMonth({ selectedDay, currentMonth, daysWithEvents, viewAll, setViewAll, handlePreviousMonth, handleNextMonth, handleDayClick, searchTerm, setSearchTerm, isSearching, setIsSearching, handleViewAll }: HeaderEventMonthProps) {
    return (
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
                    <a href={`/admin/form-event`} className="bg-black  font-bold  flex items-center px-2 text-[14px] text-white rounded-full hover:bg-gray-600/90">
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

    );
}