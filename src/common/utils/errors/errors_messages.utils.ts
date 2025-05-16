
export const errorMessages: Record<number, string> = { 
    401: "Credenciales inválidas.",
    403: "Acceso denegado.",
    404: "Recurso no encontrado.",
    500: "Ha ocurrido un error en el servidor.",
    409: "El recurso ya existe.",
    422: "Datos no válidos.",
    400: "Solicitud incorrecta."
  };
  
  export const moduleErrorMessages: Record<string, Record<number, string>> = {
    login: {
      401: "Credenciales inválidas.",
      404: "Usuario no encontrado.",
      403: "Acceso denegado.",
    },
    registeCoffelover: {
        409: "El correo eléctronico ya se encuentra registrado"
    },
    stores: {
        409: "Ya existe una tienda con esa información"
    },
    registerAdminStores:{
        409: "El correo o la cédula ya se encuentran registrados"
    },
    branches:{
        409: "El nombre de la sucursal ya se encuentra registrado",
        404: "Uy... no pudimos encontrar esta tienda. Es posible que haya sido eliminada o que el enlace sea incorrecto."
    },
    images:{
        409: "La imagen ya se encuentra registrada"
    },
    criteria:{
        409: "El criterio ya se encuentra registrado"
    },
    createAlbum: {
        409: "El álbum ya se encuentra registrado"
    },
    createPage:{
        409: "La página ya se encuentra registrada"
    },
    editCoffelover:{
        409: "El correo eléctronico ya se encuentra registrado"
    },
    attributes:{
        409: "Uno de los atributos ya se encuentra registrado" 
    }
  
  };