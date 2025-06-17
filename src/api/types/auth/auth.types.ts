export interface User {
  email: string,
  password: string,
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id?: 0
    email: string;
    role: string;
  },
  storeId?: number
  branchId?: number,
  storeOrBranchId?:number
}

export interface User_Data {
  id_google?: string,
  email: string,
  password?: string
}

export interface PersonData {
  full_name: string,
  type_document: string,
  number_document: string,
  phone_number: string
}


export interface Register_admin_stores {
  storeData: {
    id: number
  },
  userData: User_Data,
  personData: PersonData
}



export interface RegisterCoffelover {
  userData: User_Data,
  personData: PersonData
}


export interface RegisterCoffeloverResponse {
  message: string,
  client: {
    id: number,
    person: {
      user_id: number,
      user_email: string,
      type_document: string,
      number_document: string,
      full_name: string,
      phone_number: string
    }
  }
}