import { InputEmail } from "@/common/atoms/Input-email";
import { LoginCard } from "@/common/molecules/LoginCard";
import { useState } from "react";


const Formlogin = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<{ email: string; password: string }>({ email: '', password: '' })    
  
  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        console.log(data)
      
        // Simulate authentication delay
        setTimeout(() => {
          setIsLoading(false)
          // If successful, redirect to dashboard
          // router.push("/dashboard")
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