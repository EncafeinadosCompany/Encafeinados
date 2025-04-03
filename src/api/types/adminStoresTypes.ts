import { PersonData, User_Data } from "./authTypes"

export interface RegisterAdminStores {
  storeData: {
    id: number
  },
  userData: User_Data,
  personData: PersonData
}