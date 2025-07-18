import Formlogin from "@/common/widgets/forms/auth/form_login.widget"

const LoginPage = () => {

  return (
    <div className=" overflow-y-hidden sm:min-h-screen bg-white md:bg-gradient-to-b md:from-orange-50 md:to-orange-200 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center ">
        <div className="w-full max-w-sm md:max-w-4xl">
          <Formlogin />
        </div>
      </div>
    </div>
  )

}

export default LoginPage