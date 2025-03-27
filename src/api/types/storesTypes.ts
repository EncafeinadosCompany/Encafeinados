export interface Store {
    id: number
    name: string
    type_document: number
    number_document: string
    imagenUrl?: string
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