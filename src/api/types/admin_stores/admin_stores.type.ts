import { PersonData, User_Data } from "../auth/auth.types"

export interface RegisterAdminStores {
  storeData: {
    id: number
  },
  userData: User_Data,
  personData: PersonData
}

export interface RegisterAdminData {
  userData: {
    email: string,
    password: string,
    roles: string[]
  },
  personData: {
    type_document: string,
    number_document: string,
    full_name: string,
    phone_number: string
  },
  entityData?: {
    branchId?: string | number
    storeId?: string | number
  }
}