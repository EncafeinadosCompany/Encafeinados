interface DocumentType {
    clave: string
    description: string
  }

export const documentTypeList: DocumentType[] = [
    {
        clave: 'NIT',
        description: 'NIT',
    },
    {
        clave: 'CC',
        description: 'Cédula de Ciudadanía (CC)',
    },
    {
        clave: 'TI',
        description: 'Tarjeta de Identidad (TI)',
    },
    {
        clave: 'CE',
        description: 'Cédula de Extranjería (CE)',
    }
]