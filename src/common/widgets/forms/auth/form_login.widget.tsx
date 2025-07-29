import { loginSchema } from "@/common/utils/schemas/auth/login.shema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { LoginCard } from "@/common/molecules/auth/login/login_card.molecule";
import { useLoginMutation } from "@/api/mutations/auth/authMutations";
import { User, User_Data, UserData } from "@/api/types/auth/auth.types";
import { getEncryptedItem } from "@/common/utils/security/storage_encrypted.utils";
import { useNavigate } from "react-router-dom";

const Formlogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const useLogin = useLoginMutation();
  const navigate = useNavigate();
  const user = getEncryptedItem("user");

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: User) => {
    try {
      setIsLoading(true);

        
   
        await useLogin.mutateAsync(data as User_Data);
        useLogin.reset();
      
    } finally {
      setIsLoading(false);
      reset();
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      window.open(`${import.meta.env.VITE_API_URL}/auth/google`, "_blank");
    } catch (error) {
      console.error("Error during Google authentication:", error);
      toast.error("No se pudo conectar con Google. Intenta nuevamente.");
    }
  };

  return (
    <LoginCard
      user={(user as UserData) || null}
      register={register}
      errors={errors}
      control={control}
      isLoading={isLoading}
      onSubmit={handleSubmit(onSubmit)}
      onGoogleSignIn={handleGoogleSignIn}
    ></LoginCard>
  );
};

export default Formlogin;
