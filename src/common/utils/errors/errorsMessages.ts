export const errorMessages: Record<number, string> = { 
    401: "Credenciales inválidas.",
    403: "Acceso denegado.",
    404: "Recurso no encontrado.",
    500: "Ha ocurrido un error en el servidor.",
    409: "El recurso ya existe.",
    422: "Datos no válidos.",
    // Agregar más códigos según se necesiten
  };
  
  export const moduleErrorMessages: Record<string, Record<number, string>> = {
    login: {
      401: "Credenciales inválidas.",
      403: "Acceso denegado.",
    },
    registeCoffelover: {
        409: "El correo eléctronico ya se encuentra registrado"
    }
  
  };