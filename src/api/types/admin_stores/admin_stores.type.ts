import { PersonData, User_Data } from "../auth/auth.types"

export interface RegisterAdminStores {
  storeData: {
    id: number
  },
  userData: User_Data,
  personData: PersonData
}