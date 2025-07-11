export interface AttributeCategory {
  id: number;
  name: string;
}

export interface AttributeCategoriesResponse {
  categories: AttributeCategory[];
}

export interface Attribute {
  id: number;
  category: string;
  name: string;
  description: string;
  requires_response: boolean;
  status: boolean;
}

export interface AttributesByCategoryResponse {
  attributes: Attribute[];
}
