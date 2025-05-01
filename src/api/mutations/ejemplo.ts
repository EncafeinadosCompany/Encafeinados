import AuthClient from "@/api/client/axios";
import { useError } from "@/common/hooks/auth/useErrors";
import { handleApiError } from "@/common/utils/errors/handleApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

const authClient = new AuthClient();

interface body {
    name: string
}


interface bodyResponse {
    message: string
    statusCode: number,
    body: body
}


export const useEjemploMutation = () => {

    const queryClient = useQueryClient()

    const useErrors = useError("registeCoffelover")

    return useMutation<bodyResponse, Error, body>({
        mutationFn: async (formData: body): Promise<bodyResponse> => {



            try {

                const response = async () => {
                    const data: bodyResponse = {
                        statusCode: 200,
                        message: "Registro exitoso",
                        body: formData,
                    };
                    return data;
                };
                return await response();

            } catch (error: any) {
                throw handleApiError(error)
            }
        },

            onSuccess: (data) => {
                toast.success("tu registro fue un éxito", {
                    duration: 2000,
                    position: 'top-right',
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                });

            queryClient.invalidateQueries({ queryKey: ['ejemplo'] });
            },

            onError: (error: any) => {
              toast.remove();
              useErrors(error);
    }
  })
 }


