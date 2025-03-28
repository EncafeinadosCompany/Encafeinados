export interface User {
    email: string,
    password: string,
}

export interface LoginResponse {
    accessToken: string;
    user: {
      email: string;
      role: string;
    };
  }
  
export interface User_Data {
  id_google?: string,
  email: string,
  password: string,
  role_id: number
}

interface PersonData {
  full_name: string,
  type_document: number,
  number_document:string,
  phone_number: string
}

export interface RegisterCoffelover {
    userData: User_Data,
    personData: PersonData
}