export interface UpdateProfileRequest {
  user_id?: number;
  email?: string;
  type_document?: string;
  full_name?: string;
  phone_number?: string;
}

export interface CoffeeLoverProfileType {
  id: number;
  person: {
    user_id: number;
    user_email: string;
    type_document?: string;
    number_document?: string;
    full_name: string;
    phone_number: string;
  };
  coffee_coins: number;
  is_verified?: boolean;
}