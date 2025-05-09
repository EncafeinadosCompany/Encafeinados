export const handleApiError = (error: any) => {
    if(error?.response?.data){
        return error.response.data;
    }
    return {message: "Ocurrió un error inesperado" , statusCode: 500 }
}