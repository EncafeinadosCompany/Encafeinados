import { useState } from 'react';
import { Card, CardContent } from "@/common/ui/card";
import { Input } from "@/common/ui/input";
import { motion } from "framer-motion";
import { Coffee, CalendarDays} from "@/common/ui/icons";
import { Label } from "@/common/ui/label";
import { useQuantityStampByPeriod } from '@/api/queries/dashboard/stapms_by_period.query';
import { getEncryptedItem } from '@/common/utils/security/storage_encrypted.utils';
import { StampIcon } from 'lucide-react';

export default function Dashboard_Branch() {
  
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [startDate, setStartDate] = useState<Date>(firstDayOfMonth);
    const [endDate, setEndDate] = useState<Date>(new Date());
    const branchId = getEncryptedItem("branchId") as number | null;

   
    const { data: stampsByPeriodData, isLoading: stampsLoading } = useQuantityStampByPeriod(
        startDate, 
        endDate, 
        branchId || undefined
    );

    
    const branchData = stampsByPeriodData?.[0];

   
    const StatCard = ({ title, value, icon: Icon, subtitle, loading = false, color = "amber" }: any) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="relative overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-600">{title}</p>
                            {loading ? (
                                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                            ) : (
                                <p className="text-3xl font-bold text-gray-900">{value}</p>
                            )}
                            {subtitle && (
                                <p className="text-xs text-gray-500">{subtitle}</p>
                            )}
                        </div>
                        <div className={`p-3 bg-${color}-50 rounded-lg`}>
                            <Icon className={`h-6 w-6 text-${color}-500`} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );

    return (
        <div className="w-full h-full bg-gray-50 min-h-[80vh] overflow-y-auto scrollbar-thin p-4 md:p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Dashboard de Estampas ☕
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {branchData ? `Sucursal: ${branchData.branchName}` : ''}
                        </p>
                    </div>
                </motion.div>

                {/* Filtros de fecha */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
                >
                    <div className="flex gap-4 items-end">
                        <div className="flex flex-col gap-1">
                            <Label className="text-xs text-gray-500">Fecha inicio</Label>
                            <Input
                                type="date"
                                value={startDate.toISOString().split('T')[0]}
                                onChange={(e) => setStartDate(new Date(e.target.value))}
                                className="border border-gray-200"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className="text-xs text-gray-500">Fecha fin</Label>
                            <Input
                                type="date"
                                value={endDate.toISOString().split('T')[0]}
                                onChange={(e) => setEndDate(new Date(e.target.value))}
                                className="border border-gray-200"
                            />
                        </div>
                    </div>

                    <div className="flex-1 flex items-end">
                        <div className="bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
                            <p className="text-sm text-amber-700">
                                📅 Período: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Cards de estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StatCard
                        title="Total de Estampas"
                        value={branchData?.total.toLocaleString() || '0'}
                        icon={StampIcon}
                        subtitle="En el período seleccionado"
                        loading={stampsLoading}
                        color="indigo"
                    />
                    <StatCard
                        title="Promedio Diario"
                        value={branchData ? Math.round(branchData.total / Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))).toLocaleString() : '0'}
                        icon={CalendarDays}
                        subtitle="Estampas por día"
                        loading={stampsLoading}
                        color="green"
                    />
                    {/* <StatCard
                        title="Estado"
                        value={branchData ? "Activa" : "Sin datos"}
                        icon={Clock}
                        subtitle="En el período"
                        loading={stampsLoading}
                        color="purple"
                    /> */}
                </div>

                {/* Información detallada de la sucursal */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Coffee className="h-5 w-5 text-amber-600" />
                            Información de la Sucursal
                        </h3>
                    </div>

                    <div className="p-6">
                        {stampsLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
                                <p className="text-gray-500 mt-2">Cargando información...</p>
                            </div>
                        ) : branchData ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">                     
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-2">Nombre</h4>
                                    <p className="text-lg font-semibold text-gray-900">{branchData.branchName}</p>
                                    <p className="text-sm text-gray-500 mt-1">Nombre de la sucursal</p>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-2">Estampas Totales</h4>
                                    <p className="text-2xl font-bold text-green-600">{branchData.total.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500 mt-1">En el período seleccionado</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Coffee className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                <p>No se encontraron datos para el período seleccionado</p>
                                <p className="text-sm mt-1">Intenta ajustar las fechas</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Resumen adicional */}
                {/* <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <CalendarDays className="h-5 w-5 text-amber-600" />
                        <h4 className="font-semibold text-gray-900">Análisis del Período</h4>
                    </div>
                    
                    {branchData && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                <h5 className="font-medium text-amber-900 mb-2">📊 Rendimiento</h5>
                                <p className="text-sm text-amber-700">
                                    Esta sucursal registró <strong>{branchData.total}</strong> estampas 
                                    en el período del {startDate.toLocaleDateString()} al {endDate.toLocaleDateString()}.
                                </p>
                            </div>
                            
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h5 className="font-medium text-blue-900 mb-2">📈 Promedio</h5>
                                <p className="text-sm text-blue-700">
                                    Promedio de <strong>
                                        {Math.round(branchData.total / Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))))}
                                    </strong> estampas por día en este período.
                                </p>
                            </div>
                        </div>
                    )}
                </motion.div> */}
            </div>
        </div>
    );
}