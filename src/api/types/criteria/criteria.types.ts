export interface criteriaList {
    criteriaId: number,
    response_text: string;
    image_url? :{
        file: File;
        preview: string;
    };
}

export interface criteria {
    branchId: number;
    criteriaResponseData: criteriaList[];
}
export interface criteriaResponseData {
    id: number,
    name: string,
    description: string,
    active: boolean,
    requires_image: boolean,
    }