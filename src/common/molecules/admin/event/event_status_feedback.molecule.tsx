import { Button } from "@/common/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/common/ui/card";
import { Ghost, Loader2, Plus, RefreshCw, X } from'@/common/ui/icons';
import { format } from "date-fns";

import { es } from "date-fns/locale";

type StatusFeedbackProps = {
    status: "loading" | "error" | "empty";
    message?: string;
    refetch?: () => void;
    selectedDay?: Date | null;
    currentMonth?: Date;
    searchTerm?: string;
    viewAll?: boolean;
};

export const StatusFeedbackEvent = ({ status, message, refetch, selectedDay, currentMonth, searchTerm, viewAll }: StatusFeedbackProps) => {
    if (status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center h-64 w-full">
                <Loader2 className="h-10 w-10 text-[#6F4E37] animate-spin mb-4" />
                <p className="text-[#6F4E37] text-lg font-medium">{message}</p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <Card className="w-full bg-red-50 border-red-100">
                <CardHeader className="space-y-1 flex flex-col items-center text-center p-6">
                    <X className="h-12 w-12 text-red-500 mb-2" />
                    <CardTitle className="text-xl text-red-700">Error al cargar eventos</CardTitle>
                    <CardDescription className="text-red-600">
                        No pudimos cargar los eventos. Por favor, intenta nuevamente.
                    </CardDescription>
                    <Button
                        onClick={() => refetch && refetch()}
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reintentar
                    </Button>
                </CardHeader>
            </Card>
        );
    }

    if (status === "empty") {
        return (
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
                                : `No hay eventos programados para ${format(currentMonth ?? new Date(), 'MMMM yyyy', { locale: es })}`
                    }
                </p>
                <Button className="mt-6 bg-[#6F4E37] hover:bg-[#5C4130] text-white">
                    <a href={`/admin/form-event?start_time=${selectedDay ? format(selectedDay, 'dd MMMM yyyy', { locale: es }) : format(new Date(), 'dd MMMM yyyy', { locale: es })}`} className="flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        <span className="me-2">Crear Evento</span>
                    </a>
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 text-gray-500">
            <Ghost className="w-6 h-6" />
            <p className="mt-2">{message ?? "No hay información disponible"}</p>
        </div>
    );
};
