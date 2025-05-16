export interface Attribute {
    id: number;
    name: string;
    description?: string;
    status?: boolean;
}

export interface Attributes {
    attributes: Attribute[];
}


export interface RegisterAttibute {
    id: string
    attributeId: number
    type: string
    value: string,
    createdAt?: number
}