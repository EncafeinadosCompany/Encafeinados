export interface User {
    email: string,
    password: string,
}

export interface LoginResponse {
    accessToken: string;
    user: {
      id?:number
      email: string;
      role: string;
    },
	storeOrBranchId?:0
  }
  
export interface User_Data {
  id_google?: string,
  email: string,
  password?: string
}

export interface PersonData {
  full_name: string,
  type_document: string,
  number_document:string,
  phone_number: string
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