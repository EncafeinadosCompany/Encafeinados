import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoicesDto } from '@/api/types/dashboard/invoice_for_period.type';

export interface InvoiceData extends InvoicesDto {
  companyInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    logo?: string;
  };
}

export class PDFService {
  static async generateInvoicePDF(invoice: InvoiceData): Promise<void> {
    // Crear el elemento HTML temporal para el PDF
    const invoiceElement = this.createInvoiceHTML(invoice);
    
    // Añadir al DOM temporalmente
    document.body.appendChild(invoiceElement);
    
    try {
      // Generar canvas del HTML
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Crear PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      // Añadir imagen al PDF
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Añadir páginas adicionales si es necesario
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Descargar PDF
      pdf.save(`factura-${invoice.id}-${invoice.branch.name}.pdf`);
      
    } finally {
      // Limpiar DOM
      document.body.removeChild(invoiceElement);
    }
  }
  
private static createInvoiceHTML(invoice: InvoiceData): HTMLElement {
  const container = document.createElement('div');
  container.style.cssText = `
    width: 800px;
    padding: 50px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: white;
    color: #333;
    line-height: 1.4;
    font-size: 14px;
  `;
  
  // Solo usar los datos reales del invoice - NO INVENTAR
  const totalAmount = parseFloat(invoice.totalAmount);
  
  // Si necesitas IVA como línea adicional, calcularlo por separado
  const baseAmount = totalAmount / 1.19; // Asumiendo que el total incluye IVA
  const ivaAmount = totalAmount - baseAmount;
  
  // Función para formatear moneda colombiana
  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  container.innerHTML = `
    <div>
      <!-- Header con logo y información -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 50px;">
        <!-- Logo y empresa -->
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f59e0b, #d97706); margin-right: 15px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; font-size: 18px;">
              E
            </div>
            <div>
              <div style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 2px;">
                ${invoice.companyInfo.name.toUpperCase()}
              </div>
              <div style="font-size: 12px; color: #6b7280;">
                Plataforma de Soluciones Cafeteras
              </div>
            </div>
          </div>
          
          <div style="color: #6b7280; font-size: 12px; line-height: 1.6;">
            <div>${invoice.companyInfo.address}</div>
            <div style="margin-top: 3px;">📞 ${invoice.companyInfo.phone}</div>
            <div style="margin-top: 3px;">✉️ ${invoice.companyInfo.email}</div>
            <div style="margin-top: 3px;">🌐 NIT: 900.123.456-7</div>
          </div>
        </div>
        
        <!-- Invoice info -->
        <div style="text-align: right; min-width: 250px;">
          <div style="font-size: 36px; font-weight: 300; color: #1f2937; margin-bottom: 20px; letter-spacing: -1px;">
            Factura
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-left: 4px solid #f59e0b;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #6b7280; font-size: 12px; font-weight: 500;">No. FACTURA</span>
              <span style="font-weight: 600; color: #1f2937;">FV-${invoice.id.toString().padStart(6, '0')}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #6b7280; font-size: 12px; font-weight: 500;">FECHA EMISIÓN</span>
              <span style="font-weight: 600; color: #1f2937;">${new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #6b7280; font-size: 12px; font-weight: 500;">FECHA VENCIMIENTO</span>
              <span style="font-weight: 600; color: #1f2937;">${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Información de Facturación -->
      <div style="margin-bottom: 40px;">
        <div style="display: flex; justify-content: space-between;">
          <!-- Facturar a -->
          <div style="flex: 1; margin-right: 40px;">
            <div style="font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">
              FACTURAR A
            </div>
            <div style="font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">
              ${invoice.branch.name}
            </div>
            <div style="color: #6b7280; font-size: 13px; line-height: 1.6;">
              <div>📅 Período de Servicio:</div>
              <div>${new Date(invoice.startDate).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })} - ${new Date(invoice.endDate).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
          </div>
          
          <!-- Dirección de la empresa -->
          <div style="flex: 1; text-align: right;">
            <div style="font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">
              EMPRESA
            </div>
            <div style="color: #6b7280; font-size: 13px; line-height: 1.6;">
              <div style="font-weight: 600; color: #1f2937; margin-bottom: 4px;">${invoice.companyInfo.name}</div>
              <div>${invoice.companyInfo.address}</div>
              <div>📞 ${invoice.companyInfo.phone}</div>
              <div>✉️ ${invoice.companyInfo.email}</div>
              <div>🆔 NIT: 900.123.456-7</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tabla de Servicios -->
      <div style="margin-bottom: 40px;">
        <table style="width: 100%; border-collapse: collapse;">
          <!-- Header -->
          <thead>
            <tr style="border-bottom: 2px solid #e5e7eb;">
              <th style="padding: 15px 0; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">
                Descripción del Servicio
              </th>
              <th style="padding: 15px 0; text-align: center; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; width: 80px;">
                Cant.
              </th>
              <th style="padding: 15px 0; text-align: center; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">
                Valor Unit.
              </th>
              <th style="padding: 15px 0; text-align: right; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; width: 140px;">
                Valor Total
              </th>
            </tr>
          </thead>
          
          <!-- Content - SOLO LOS DATOS REALES -->
          <tbody>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 20px 0;">
                <div style="color: #3b82f6; font-weight: 500; margin-bottom: 4px;">
                  Servicio de Plataforma - ${invoice.branch.name}
                </div>
                <div style="color: #6b7280; font-size: 12px;">
                  Comisión por uso de plataforma del ${new Date(invoice.startDate).toLocaleDateString('es-CO')} al ${new Date(invoice.endDate).toLocaleDateString('es-CO')}
                </div>
              </td>
              <td style="padding: 20px 0; text-align: center; color: #1f2937; font-weight: 500;">
                1
              </td>
              <td style="padding: 20px 0; text-align: center; color: #1f2937; font-weight: 500;">
                ${formatCOP(totalAmount)}
              </td>
              <td style="padding: 20px 0; text-align: right; color: #1f2937; font-weight: 600;">
                ${formatCOP(totalAmount)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Sección de Totales -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 50px;">
        <div style="min-width: 320px;">
          <!-- Subtotal (base sin IVA) -->
          <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
            <span style="color: #6b7280; font-size: 14px;">Base Gravable</span>
            <span style="color: #1f2937; font-weight: 500;">${formatCOP(baseAmount)}</span>
          </div>
          
          <!-- IVA como línea separada -->
          <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
            <span style="color: #6b7280; font-size: 14px;">IVA (19%)</span>
            <span style="color: #1f2937; font-weight: 500;">${formatCOP(ivaAmount)}</span>
          </div>
          
          <!-- Total - EL DATO REAL DE LA FACTURA -->
          <div style="display: flex; justify-content: space-between; padding: 18px 0; border-top: 2px solid #e5e7eb; margin-top: 10px; background: #f8fafc; padding-left: 15px; padding-right: 15px; margin-left: -15px; margin-right: -15px;">
            <span style="color: #1f2937; font-size: 16px; font-weight: 600;">TOTAL A PAGAR</span>
            <span style="color: #3b82f6; font-size: 18px; font-weight: 700;">${formatCOP(totalAmount)}</span>
          </div>
          
          <!-- Total en letras -->
          <div style="margin-top: 10px; font-size: 12px; color: #6b7280; text-align: center; font-style: italic;">
            Son: ${this.numeroALetras(Math.round(totalAmount))} PESOS COLOMBIANOS
          </div>
        </div>
      </div>
      
      <!-- Instrucciones de Pago -->
      <div style="background: #f0f9ff; padding: 20px; border-left: 4px solid #3b82f6; margin-bottom: 30px;">
        <div style="font-weight: 600; color: #1e40af; margin-bottom: 8px; font-size: 14px;">
          📋 INSTRUCCIONES DE PAGO
        </div>
        <div style="color: #475569; font-size: 13px; line-height: 1.6; margin-bottom: 15px;">
          Transfiera el monto a la cuenta empresarial que se indica a continuación. Por favor incluya el número de factura en la referencia del pago.
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 15px;">
          <div style="background: white; padding: 12px; border-radius: 6px;">
            <div style="font-weight: 600; color: #1f2937; font-size: 12px; margin-bottom: 4px;">🏦 BANCO</div>
            <div style="color: #6b7280; font-size: 12px;">Bancolombia</div>
          </div>
          <div style="background: white; padding: 12px; border-radius: 6px;">
            <div style="font-weight: 600; color: #1f2937; font-size: 12px; margin-bottom: 4px;">💳 CUENTA CORRIENTE</div>
            <div style="color: #6b7280; font-size: 12px;">123-456789-01</div>
          </div>
          <div style="background: white; padding: 12px; border-radius: 6px;">
            <div style="font-weight: 600; color: #1f2937; font-size: 12px; margin-bottom: 4px;">🆔 NIT</div>
            <div style="color: #6b7280; font-size: 12px;">900.123.456-7</div>
          </div>
        </div>
      </div>
      
      <!-- Notas -->
      <div style="margin-bottom: 40px;">
        <div style="font-weight: 600; color: #1f2937; margin-bottom: 8px; font-size: 14px;">
          📝 OBSERVACIONES
        </div>
        <div style="color: #6b7280; font-size: 13px; line-height: 1.6;">
          • Esta factura corresponde al período del ${new Date(invoice.startDate).toLocaleDateString('es-CO')} al ${new Date(invoice.endDate).toLocaleDateString('es-CO')}.<br>
          • El pago debe realizarse dentro de los 30 días calendario posteriores a la fecha de emisión.<br>
          • Esta factura es válida como documento tributario electrónico.<br>
          • Estado actual de la factura: ${invoice.isPaid ? 'PAGADA' : 'PENDIENTE DE PAGO'}.<br><br>
          <strong>¡Gracias por confiar en nuestros servicios!</strong> ☕
        </div>
      </div>
      
      <!-- Footer -->
      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; display: flex; justify-content: space-between; align-items: center;">
        <div style="color: #9ca3af; font-size: 11px;">
          <div style="font-weight: 600; margin-bottom: 4px; color: #f59e0b;">${invoice.companyInfo.name.toUpperCase()}</div>
          <div>📍 Carrera 15 #93-47, Bogotá D.C., Colombia</div>
          <div>☎️ Línea Nacional: 01 8000 123 456</div>
        </div>
        
        <div style="text-align: center; color: #9ca3af; font-size: 11px;">
          <div style="font-weight: 600; margin-bottom: 4px;">CONTACTO</div>
          <div>✉️ ${invoice.companyInfo.email}</div>
          <div>📱 ${invoice.companyInfo.phone}</div>
          <div>🌐 www.encafeinados.com</div>
        </div>
        
        <div style="text-align: right; color: #9ca3af; font-size: 11px;">
          <div style="font-weight: 600; margin-bottom: 4px;">INFORMACIÓN TRIBUTARIA</div>
          <div>🆔 NIT: 900.123.456-7</div>
          <div>📋 Régimen Común</div>
          <div>✅ Autorretenedor</div>
          <div>📄 Resolución DIAN No. 18764028000331</div>
        </div>
      </div>
      
      <!-- Marca de agua -->
      <div style="position: absolute; bottom: 100px; right: 50px; opacity: 0.1; transform: rotate(-45deg); font-size: 48px; font-weight: bold; color: #f59e0b; pointer-events: none;">
        ${invoice.isPaid ? 'PAGADA' : 'PENDIENTE'}
      </div>
    </div>
  `;
  
  return container;
}
  
  // Función auxiliar para convertir números a letras (simplificada)
  private static numeroALetras(numero: number): string {
    const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const decenas = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];
    
    if (numero === 0) return 'CERO';
    if (numero === 100) return 'CIEN';
    
    // Simplificación para números grandes
    if (numero >= 1000000) {
      const millones = Math.floor(numero / 1000000);
      const resto = numero % 1000000;
      return `${millones > 1 ? this.numeroALetras(millones) + ' MILLONES' : 'UN MILLÓN'}${resto > 0 ? ' ' + this.numeroALetras(resto) : ''}`;
    }
    
    if (numero >= 1000) {
      const miles = Math.floor(numero / 1000);
      const resto = numero % 1000;
      return `${miles > 1 ? this.numeroALetras(miles) + ' MIL' : 'MIL'}${resto > 0 ? ' ' + this.numeroALetras(resto) : ''}`;
    }
    
    if (numero >= 100) {
      const cen = Math.floor(numero / 100);
      const resto = numero % 100;
      return `${centenas[cen]}${resto > 0 ? ' ' + this.numeroALetras(resto) : ''}`;
    }
    
    if (numero >= 20) {
      const dec = Math.floor(numero / 10);
      const resto = numero % 10;
      return `${decenas[dec]}${resto > 0 ? ' Y ' + unidades[resto] : ''}`;
    }
    
    return unidades[numero] || '';
  }
}