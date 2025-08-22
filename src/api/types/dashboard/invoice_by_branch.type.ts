export interface InvoiceByBranchResponse {
	branchId: string
	branchName: string
    invoices: invoicesBranch[]

	
}
export interface invoicesBranch 
		{
			invoiceId: number,
			startDate: Date,
			endDate: Date,
			totalVisits: number,
			totalAmount: string,
			isPaid: boolean
		}