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


export interface GetcriteriaByBranch
{
    branch: {
		id: number,
		name: string,
		phoneNumber: string,
		latitude: number,
		longitude: number,
		address: string
	},
	criteriaResponses: 
	criteriaResponses[]
    }

    export interface criteriaResponses{
        criteria: {
            name: string,
            description: string
        },
        responseText: string,
        imageUrl: string
    }

export interface criteriaResponseData {
    id: number,
    name: string,
    description: string,
    active: boolean,
    requires_image: boolean,
    }


export interface GetcriteriaByBranchResponse
{
    branch: {
		id: number,
		name: string,
		phoneNumber: string,
		latitude: number,
		longitude: number,
		address: string
	},
	criteriaResponses: criteriaResponseData[]
    }

