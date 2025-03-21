export interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'coffeelover' | 'store'
  }


 export  interface LoginResponse {
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
  firstName: string,
  lastName: string,
  phone:string,
  address:string
}

export interface LoginFormData {
    userData: User_Data,
    PersonData: PersonData
}