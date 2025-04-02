import { useLoginGoogleMutation, useLoginMutation, User, User_Data } from "@/api";

import { loginSchema } from "@/common/utils/schemas/auth/loginShema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/common/molecules/hooks/useAuth";
import { LoginCard } from "@/common/molecules/auth/LoginCard";

const Formlogin = () => {

  const [isLoading, setIsLoading] = useState(false)
  const useLogin = useLoginMutation()
  const navigate = useNavigate()
  const { pagesPermissions } = useAuth()

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: User) => {
    try {
      setIsLoading(true);

      const response = await useLogin.mutateAsync(data as User_Data);

      toast.success("Inicio de sesión exitoso");

      if (response?.user) {
        const roleId = response.user.role;
        pagesPermissions(roleId, navigate);
      }

    } finally {
      setIsLoading(false);
      reset();
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
     window.location.href = "http://localhost:3000/api/v2/auth/google";
    // window.open(
    //      'http://localhost:3000/api/v2/auth/google',
    //     'googleAuth',
    //      'width=500,height=600'
    //  );
    // try {
    //   const user = await signInWithGoogle();
    //   // console.log("Usuario logueado:", user);
    //   fetchUser();

    //   toast.success("Inicio de sesión exitoso");
      

    //   console.log("Usuario logueado:", user);
    // } catch (error) {
    //   console.error("Error en el login:", error);

    //   setTimeout(() => {
    //     setIsLoading(false)
    //   }, 1000)
    // }
  }

  return (
    <div className="" >
      <LoginCard
        register={register}
        errors={errors}
        isLoading={isLoading}
        onSubmit={handleSubmit(onSubmit)}
        onGoogleSignIn={handleGoogleSignIn}>
      </LoginCard>
    </div>
  )
}


export default Formlogin;