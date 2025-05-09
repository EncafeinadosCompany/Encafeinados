export interface Stamps {
    id: number;
    logo: string;
    name: string;
    description: string;
    coffeecoins_value: number;
    status: boolean;
}


export interface AddStampsToPageDto {
    pageId: number;
    stampIds: number[];
}

export interface StampsResponse {
    pageId?: number;
    stamps: Stamps[];
}

export interface StampsByClientResponse {
    client_id: number,
    stamps: [
        {
            id: number,
            coffecoins_earned: number
            quantity?: number
        }
    ]
}