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

export interface ReviewSubmitInput {
    branchId: number;
    userId: number;
    rating: number;
    comment: string;
    imageUrls: string[];
  }
  
  export interface ReviewSubmitResponse {
    id: string;
    clientName: string;
    rating: number;
    comment: string;
    imageUrls: string[];
    createdAt: string;
    message: string;
  }

  export interface ClientReview {
    id: number;
    branchName: string;
    rating: number;
    comment: string;
    imageUrls: string[];
    createdAt: string;
}

export interface ClientWithReviews {
    clientId: number;
    clientName: string;
    reviews: ClientReview[];
}