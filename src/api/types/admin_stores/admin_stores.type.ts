import { PersonData, User_Data } from "../auth/auth.types"

export interface RegisterAdminStores {
  storeData: {
    id: number
  },
  userData: User_Data,
  personData: PersonData
}

export interface CreateBranchAdminData {
  branchData: {
    id: number
  },
  userData: {
    email: string,
    password: string
  },
  personData: {
    type_document: string,
    number_document: string,
    full_name: string,
    phone_number: string
  }
}