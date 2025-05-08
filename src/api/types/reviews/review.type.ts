export interface SingleReview {
    id: number;
    clientName: string;
    rating: number;
    comment: string;
    imageUrls: string[];
    createdAt: string;
}

export interface Reviews {
    branchId: number;
    branchName: string;
    reviews: SingleReview[];
}
