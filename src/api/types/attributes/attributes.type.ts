export interface Attribute {
    id: number;
    name: string;
    description?: string;
    requires_response:boolean
    status?: boolean;
}

export interface Attributes {
    attributes: Attribute[];
}



export interface AttributeByID {
     attributes:attributeValue[]
}

export interface attributeValue {
    attributeId: number,
    attributeName: string,
    value: string
}

export interface RegisterAttibute {
    id: string
    attributeId: number
    value?: string,
    createdAt?: number
}