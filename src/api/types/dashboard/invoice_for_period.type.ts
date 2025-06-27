export interface Period {
    startDate: string | Date;
    endDate: string | Date;
}



export interface InvoiceForPeriodResponse {
    start_date: string;
    end_date: string;
    total_visits: number;
    total_amount: number;
    branch: {
        id: number;
        name: string;
        phone_number: string;
        latitude: number;
        longitude: number;
        address: string;
        average_rating: string;
        details: string;
        status: string;
        is_open: boolean;
        createdAt: string;
        updatedAt: string;
        store: {
            id: number;
            name: string;
            type_document: string;
            number_document: string;
            logo: string;
            phone_number: string;
            email: string;
            status: string;
            createdAt: string;
            updatedAt: string;
        };
        social_branches: Array<{
            id: number;
            description: string;
            value: string;
            createdAt: string;
            updatedAt: string;
        }>;
    }
}



export interface InvoicesDto{
    
        id: number;
        branch: {
            id: number;
            name: string;
        };
        startDate: string;
        endDate: string;
        totalVisits: number;
        totalAmount: string;
        isPaid: boolean;
    
}
export interface InvoiceResponse {
    invoices: InvoicesDto[];
}