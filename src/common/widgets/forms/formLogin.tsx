import { LoginFormData, useLoginMutation, User_Data } from "@/api";
import { authState } from "@/common/atoms/authAtom";
import { InputEmail } from "@/common/atoms/Input-email";
import { LoginCard } from "@/common/molecules/LoginCard";
import { use } from "chai";
import { useState } from "react";
import { useRecoilValue } from "recoil";


const Formlogin = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<{ email: string; password: string }>({ email: '', password: '' })    
  const  useLogin = useLoginMutation()
  
  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        console.log(data)

      const form: LoginFormData = {
        userData: {
          email: data.email,
          password: data.password,
          role_id: 3
        },
        PersonData: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
          address: '123 Main St',
        }
      }

        useLogin.mutateAsync(data as User_Data)

        if(useLogin.error){
          console.log(useLogin.error)
        }
      
        setTimeout(() => {
          setIsLoading(false)
     
        }, 1000)
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
        // })
    
        // Simulate authentication delay
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      }
  return (
    <div className="mx-4" >
      <LoginCard 
        data={data} 
        setdata={setData} 
        isLoading={isLoading} 
        handleSubmit={handleSubmit} 
        handleGoogleSignIn={handleGoogleSignIn}>
      </LoginCard>
    </div>
  )
}


export default Formlogin;