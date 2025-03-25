import Formlogin from "@/common/widgets/forms/formLogin"

export const LoginPage = () => {

    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-2 md:p-10 bg-gradient-to-b from-orange-50 to-orange-200">
        <div className="w-full max-w-sm md:max-w-3xl">
          <Formlogin />
        </div>
      </div>

    )
    
}