export interface User {
    email: string,
    password: string,
}


 export interface LoginResponse {
    accessToken: string;
    user: {
      id: number;
      role_id: number;
      email: string;
    };
  }
  
export interface User_Data {
  email: string,
  password: string,
  role_id: number
}

interface PersonData {
  full_name: string,
  type_document_id: string | number,
  number_document:string,
  phone_number: string
}

export interface RegisterCoffelover {
    userData: User_Data,
    personData: PersonData
}