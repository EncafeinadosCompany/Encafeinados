export interface Location {
    id: number
    latitude: number
    longitude: number
    address: string
    createdAt: string
    updatedAt: string
  }
  
  export interface Store {
    id: number
    user_id: number
    name: string
    type_document_id: number
    number_document: string
    logo: string
    email: string
    phone_number: string
    status: boolean
    createdAt: string
    updatedAt: string
  }
  
  export interface Branch {
    id: number
    store_id: number
    name: string
    phone_number: string
    location_id: number
    average_rating: number
    status: boolean
    createdAt: string
    updatedAt: string
    store: Store
    location: Location
  }
  
  export interface BranchesResponse {
    message: string
    branch: Branch[]
  }