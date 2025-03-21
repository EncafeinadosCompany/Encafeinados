export interface Store {
    id: number
    name: string
    type_document_id: number
    number_document: string
    logo: string
    email: string
    phone_number: string
    status: boolean
  }

  export interface StoresResponse {
    message: string
    stores: {
      store: Store[]
    }
  }