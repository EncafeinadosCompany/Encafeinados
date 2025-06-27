import React, { useState, useMemo } from 'react';
import { useCreateInvoiceMutation } from "@/api/mutations/dashboard/create_register_for_period";
import { useInvoicesForPeriod } from "@/api/queries/dashboard/list_invoices_for_period.query";
import { useQuantityStampByBranch } from "@/api/queries/dashboard/quantity_stamp_by_branch.query";
import { useQuantityVisitByBranch } from "@/api/queries/dashboard/quantity_visit_by_branch.query";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/ui/card";
import { Button } from "@/common/ui/button";
import { Input } from "@/common/ui/input";
import { Badge } from "@/common/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

import {
    Calendar,
    Search,
    Filter,
    Plus,
    TrendingUp,
    Coffee,
    Users,
    Receipt,
    Download,
    Eye,
    MoreVertical,
    CalendarDays,
    Clock
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/common/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/common/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/common/ui/select";
import { Label } from "@/common/ui/label";
import toast from "react-hot-toast";
import { InvoiceData, PDFService } from './invoices_dasboard';

export default function PruebaDashboard () {
    // Estados para filtros y búsqueda
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBranch, setSelectedBranch] = useState<number | undefined>(undefined);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newInvoiceStart, setNewInvoiceStart] = useState("");
    const [newInvoiceEnd, setNewInvoiceEnd] = useState("");

    // Queries - CORREGIDAS
    const { data: invoicesData, isLoading: invoicesLoading } = useInvoicesForPeriod(startDate, endDate);
    const { data: stampsData, isLoading: stampsLoading } = useQuantityStampByBranch(selectedBranch);
    const { data: visitsData, isLoading: visitsLoading } = useQuantityVisitByBranch(selectedBranch);
    const createInvoiceMutation = useCreateInvoiceMutation();

    // Extraer los datos correctamente
    const invoices = invoicesData?.invoices || [];
    const stampsCount = stampsData?.quantity || 0;
    const visitsCount = visitsData?.quantity || 0;

    // Datos filtrados - CORREGIDO
    const filteredInvoices = useMemo(() => {
        if (!invoices) return [];

        return invoices.filter(invoice => {
            const matchesSearch = invoice.branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                invoice.id.toString().includes(searchTerm);

            const matchesStatus = statusFilter === "all" ||
                (statusFilter === "paid" && invoice.isPaid === true) ||
                (statusFilter === "pending" && invoice.isPaid === false);

            return matchesSearch && matchesStatus;
        });
    }, [invoices, searchTerm, statusFilter]);


    console.log('branch seleccionada', visitsData, selectedBranch);

    // Crear factura - CORREGIDO
    const handleCreateInvoice = async () => {
        if (!newInvoiceStart || !newInvoiceEnd) {
            toast.error("Por favor, selecciona las fechas de inicio y fin");
            return;
        }

        try {
            await createInvoiceMutation.mutateAsync({
                startDate: newInvoiceStart, // Enviar como string según la interfaz
                endDate: newInvoiceEnd
            });

            toast.success("Factura creada exitosamente");
            setIsCreateDialogOpen(false);
            setNewInvoiceStart("");
            setNewInvoiceEnd("");
        } catch (error) {
           
        }
    };


    const handleDownloadPDF = async (invoice: any) => {
        try {
            // Crear datos de la factura con información de la empresa
            const invoiceData: InvoiceData = {
                ...invoice,
                companyInfo: {
                    name: 'Encafeinados Company',
                    address: 'Av. Principal 123, Ciudad, País',
                    phone: '+1 (555) 123-4567',
                    email: 'facturacion@encafeinados.com',
                    logo: '/cafeino.png' // Opcional: logo de la empresa
                }
            };

            // Mostrar loading
            toast.loading('Generando PDF...', { id: 'pdf-generation' });

            // Generar y descargar PDF
            await PDFService.generateInvoicePDF(invoiceData);

            // Mostrar éxito
            toast.success('PDF descargado correctamente', { id: 'pdf-generation' });

        } catch (error) {
            console.error('Error al generar PDF:', error);
            toast.error('Error al generar el PDF', { id: 'pdf-generation' });
        }
    };


    // Cards de estadísticas - SIN CAMBIOS
    const StatCard = ({ title, value, icon: Icon, trend, subtitle, loading = false }: any) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="relative overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-600">{title}</p>
                            {loading ? (
                                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                            ) : (
                                <p className="text-2xl font-bold text-gray-900">{value}</p>
                            )}
                            {subtitle && (
                                <p className="text-xs text-gray-500">{subtitle}</p>
                            )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <Icon className="h-5 w-5 text-amber-600" />
                            </div>
                            {trend && (
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                    +{trend}%
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );

    return (
        <div className="w-full h-full bg-gray-50  min-h-[80vh] overflow-y-auto scrollbar-thin p-4 md:p-6">
            <div className="max-w-full mx-auto space-y-6">
                {/* Header - SIN CAMBIOS */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            ¡Hola, Admin! ☕
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Espero que tengas un gran día de trabajo hoy
                        </p>
                    </div>

                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                                <Plus className="h-4 w-4 mr-2" />
                                Crear Factura
                            </Button>
                        </DialogTrigger>
                        <DialogContent className='bg-white rounded-xl border border-gray-100 shadow-sm max-w-lg'>
                            <DialogHeader>
                                <DialogTitle>Crear Nueva Factura</DialogTitle>
                                <DialogDescription>
                                    Selecciona el período para generar la factura
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="start-date">Fecha de Inicio</Label>
                                    <Input
                                        id="start-date"
                                        type="date"
                                        value={newInvoiceStart}
                                        onChange={(e) => setNewInvoiceStart(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="end-date">Fecha de Fin</Label>
                                    <Input
                                        id="end-date"
                                        type="date"
                                        value={newInvoiceEnd}
                                        onChange={(e) => setNewInvoiceEnd(e.target.value)}
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleCreateInvoice}
                                    disabled={createInvoiceMutation.status === "pending"}
                                    className="bg-amber-600 hover:bg-amber-700"
                                >
                                    {createInvoiceMutation.status === "pending" ? "Creando..." : "Crear Factura"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </motion.div>

                {/* Filtros - SIN CAMBIOS VISUALES */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
                >
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Buscar facturas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 text-gray-400"
                            />
                        </div>
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-40  border border-gray-200">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="paid">Pagadas</SelectItem>
                            <SelectItem value="pending">Pendientes</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={selectedBranch === undefined ? "all" : selectedBranch.toString()}
                        onValueChange={(value) => {
                            if (value === "all") {
                                setSelectedBranch(undefined as any); // or null, depending on your state type
                            } else {
                                setSelectedBranch(Number(value));
                            }
                        }}
                    >
                        <SelectTrigger className="w-full md:w-40 border-gray-200">
                            <SelectValue placeholder="Sucursal" />
                        </SelectTrigger>
                        <SelectContent>
                            <Input
                                placeholder="Buscar sucursal..."
                                className="mb-1 border border-gray-400"
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                }}
                                value={searchTerm}
                            />
                            <SelectItem value="all">Todas las cafeterías</SelectItem>
                            {Array.from(
                                new Map(
                                    invoices.map((invoice) => [
                                        invoice.branch.id,
                                        invoice.branch,
                                    ])
                                ).values()
                            )
                                .filter((branch) =>
                                    branch.name
                                        .toLowerCase()
                                        .includes(searchTerm.toLowerCase())
                                )
                                .map((branch) => (
                                    <SelectItem key={branch.id} value={branch.id.toString()}>
                                        {branch.name}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                        <Input
                            type="date"
                            value={startDate.toISOString().split('T')[0]}
                            onChange={(e) => setStartDate(new Date(e.target.value))}
                            className="w-full md:w-auto border border-gray-200"
                        />
                        <Input
                            type="date"
                            value={endDate.toISOString().split('T')[0]}
                            onChange={(e) => setEndDate(new Date(e.target.value))}
                            className="w-full md:w-auto border border-gray-200" 
                        />
                    </div>
                </motion.div>

                {/* Cards de estadísticas - VALORES CORREGIDOS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                    <StatCard
                        title="Total de Sellos"
                        value={stampsCount}
                        icon={Coffee}
                        trend="12"
                        subtitle="Sucursal actual"
                        loading={stampsLoading}
                    />
                    <StatCard
                        title="Visitas Totales"
                        value={visitsCount}
                        icon={Users}
                        trend="8"
                        subtitle="Este período"
                        loading={visitsLoading}
                    />
                    <StatCard
                        title="Facturas Generadas"
                        value={filteredInvoices.length}
                        icon={Receipt}
                        trend="15"
                        subtitle="Período seleccionado"
                        loading={invoicesLoading}
                    />
                </div>

                {/* Tabla de facturas - ESTRUCTURA CORREGIDA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-hidden"
                >
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Facturas Recientes</h3>
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                {filteredInvoices.length} facturas
                            </Badge>
                        </div>
                    </div>

                    <div className="overflow-x-auto scrollbar-thin md:overflow-x-hidden">
                        {invoicesLoading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
                                <p className="text-gray-500 mt-2">Cargando facturas...</p>
                            </div>
                        ) : filteredInvoices.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Receipt className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                <p>No se encontraron facturas</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Sucursal
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha Inicio
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha Fin
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Monto
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <AnimatePresence>
                                        {filteredInvoices.map((invoice, index) => (
                                            <motion.tr
                                                key={invoice.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="hover:bg-gray-50 transition-colors"
                                                onClick={()=>setSelectedBranch(invoice.branch.id)}
                                            >
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    #{invoice.id}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {invoice.branch.name}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <CalendarDays className="h-4 w-4 mr-1" />
                                                        {new Date(invoice.startDate).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <CalendarDays className="h-4 w-4 mr-1" />
                                                        {new Date(invoice.endDate).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <Badge
                                                        variant={invoice.isPaid ? 'default' : 'secondary'}
                                                        className={
                                                            invoice.isPaid
                                                                ? 'bg-green-100 text-green-800 border-green-200'
                                                                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                        }
                                                    >
                                                        {invoice.isPaid ? 'Pagada' : 'Pendiente'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    ${parseFloat(invoice.totalAmount).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent className='bg-red-100 border border-red-900' align="end">
                                                            <DropdownMenuItem onClick={() => handleDownloadPDF(invoice)}>
                                                                <Download className="h-4 w-4 mr-2" />
                                                                Descargar PDF
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};