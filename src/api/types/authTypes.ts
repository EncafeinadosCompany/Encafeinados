export interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'coffeelover' | 'store'
  }
  
  export interface LoginFormData {
    email: string
    password: string
  }