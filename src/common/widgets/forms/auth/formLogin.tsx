import { useLoginMutation, User, User_Data } from "@/api";
import { LoginCard } from "@/common/molecules/auth/loginCard";
import { loginSchema } from "@/common/utils/schemas/auth/loginShema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/common/molecules/hooks/useAuth";
import { LinkReturn } from "@/common/molecules/auth/linkReturn";

const Formlogin = () => {
  
  const [isLoading, setIsLoading] = useState(false)  
  const  useLogin = useLoginMutation()
  const navigate = useNavigate()
  const {pagesPermissions} = useAuth()
  
  const {register, handleSubmit, formState:{errors}, reset} = useForm({
  resolver: zodResolver(loginSchema),
  defaultValues: {
    email: '',
    password: ''
  }
})

  const onSubmit = async (data:User) => {
    try {
      setIsLoading(true);
  
      const response = await useLogin.mutateAsync(data as User_Data);

      toast.success("Inicio de sesión exitoso");

      if (response?.user) {
        const roleId = response.user.role.name;
        pagesPermissions(roleId, navigate);
      }

    } finally {
      setIsLoading(false);
      reset();
    }
}
    
  const handleGoogleSignIn = () => {
        setIsLoading(true)
    
        // Here you would implement Google sign-in
        // For example, with Supabase:
        // const { data, error } = await supabase.auth.signInWithOAuth({
        //   provider: 'google',
        //   options: {
        //     redirectTo: `${window.location.origin}/auth/callback`,
        //   },
        //  })
        
        // Simulate authentication delay
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      }



   
  return (
    <div className="mx-4" >
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