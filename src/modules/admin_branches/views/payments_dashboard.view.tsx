import { useState } from 'react';
import { Card, CardContent } from "@/common/ui/card";
import { motion } from "framer-motion";
import { CreditCard, Clock, CheckCircle, DollarSign } from "lucide-react";
import { PaymentsByBranchWidget } from '@/common/widgets/admin_branches/payment.widget';
import { getEncryptedItem } from '@/common/utils/security/storage_encrypted.utils';
import { useInvoicesByBranch } from '@/api/queries/dashboard/list_invoices_by_branch.query';

export default function PaymentsDashboard() {
    const branchId = getEncryptedItem("branchId") as number | null;

    // Query para obtener datos y estadísticas
    const { data: invoicesData, isLoading, error } = useInvoicesByBranch(branchId || 0);

    // Calcular estadísticas
    const totalInvoices = invoicesData?.invoices?.length || 0;
    const paidInvoices = invoicesData?.invoices?.filter(i => i.isPaid).length || 0;
    const pendingInvoices = totalInvoices - paidInvoices;
    const totalAmount = invoicesData?.invoices?.reduce((sum, invoice) => 
        sum + parseFloat(invoice.totalAmount), 0) || 0;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Componente de tarjeta de estadística minimalista
    const StatCard = ({ title, value, icon: Icon, color = "orange", loading = false }: any) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1 min-w-0 flex-1">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">{title}</p>
                            {loading ? (
                                <div className="h-5 sm:h-6 w-12 sm:w-16 bg-gray-200 rounded animate-pulse"></div>
                            ) : (
                                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{value}</p>
                            )}
                        </div>
                        <div className={`p-1.5 sm:p-2 bg-${color}-50 rounded-lg flex-shrink-0 ml-2`}>
                            <Icon className={`h-4 w-4 sm:h-5 sm:w-5 text-${color}-600`} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );

    return (
        <div className="w-full h-full bg-gray-50 min-h-[80vh] overflow-y-auto scrollbar-thin p-2 sm:p-3 md:p-6">
            <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
                
                {/* Header minimalista */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-2"
                >
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                            Gestión de Pagos 💳
                        </h1>
                        <p className="text-gray-600 text-xs sm:text-sm mt-1">
                            {invoicesData?.branchName || 'Cargando sucursal...'}
                        </p>
                    </div>
                </motion.div>

                {!isLoading || error ? (
                     <Card className="border border-gray-200">
                            <CardContent className="p-8 text-center">
                                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Aún no hay pagos disponibles
                                </h3>
                                <p className="text-gray-600">
                                    No te preocupes por el momento no tienes pagos disponibles
                                </p>
                            </CardContent>
                        </Card>
                ):(
                    
                <>
                
                {/* Cards de estadísticas minimalistas */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                    <StatCard
                        title="Total"
                        value={totalInvoices}
                        icon={CreditCard}
                        color="blue"
                        loading={isLoading}
                    />
                    <StatCard
                        title="Pagadas"
                        value={paidInvoices}
                        icon={CheckCircle}
                        color="green"
                        loading={isLoading}
                    />
                    <StatCard
                        title="Pendientes"
                        value={pendingInvoices}
                        icon={Clock}
                        color="orange"
                        loading={isLoading}
                    />
                    <StatCard
                        title="Monto Total"
                        value={isLoading ? "..." : formatCurrency(totalAmount)}
                        icon={DollarSign}
                        color="purple"
                        loading={isLoading}
                    />
                </div>

                {/* Widget principal de pagos */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full"
                >
                    {branchId ? (
                        <PaymentsByBranchWidget 
                            branchId={branchId}
                            onPaymentSuccess={(invoiceId) => {
                            }}
                        />
                    ) : (
                        <Card className="border border-gray-200">
                            <CardContent className="p-8 text-center">
                                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No se pudo cargar la información
                                </h3>
                                <p className="text-gray-600">
                                    No se encontró el ID de la sucursal
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>

                {/* Resumen simple en el footer */}
                {invoicesData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    {paidInvoices} Pagadas
                                </span>
                                <span className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    {pendingInvoices} Pendientes
                                </span>
                            </div>
                            
                            <div className="text-sm text-gray-500">
                                Última actualización: {new Date().toLocaleTimeString('es-CO', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
                
                </>)}
            </div>
        </div>
    );
}
